---
title: "FlashHead: Engineering Deep Dive"
tags: ["FlashHead", "LLM Optimization", "Information Retrieval", "Hardware-Aware"]
image: "https://raw.githubusercontent.com/embedl/flash-head/master/docs/flash_head_flow_diagram_dark.svg"
imageAlt: "FlashHead two-stage retrieval flow diagram"
kind: "deep-dive"
hook: "How the classification head is a bottleneck for small models and how we fixed it."
keyPoints:
  - "The LM classification head is a bottleneck for small models—it can't be quantized and vocab size often exceeds hidden dimension"
  - "Balanced clusters give consistent latency regardless of prompt, at the cost of some clustering quality"
  - "Selective quantization on the first matmul was an accidental discovery from a whiteboard discussion"
  - "Fixed 256 probes perform well—we tried dynamic but didn't see significant improvement"
related: ["how-to-prune-attention", "cosmos-reason2-report"]
---

# FlashHead: Research Notes

## The Problem

For small language models (below 8B), the classification head (the final layer that maps hidden states to vocabulary tokens) is still a **bottleneck**. 

Two main reasons:
The matrix multiplication is just huge

1. **Can't be quantized** - Unlike the rest of the model, the head typically stays in FP16/FP32 because quantization destroys accuracy
2. **Huge matrix multiply** - Hidden dimension (~4k - Llama3.2 3B has 3072, Qwen3 1.7B has 2048, Qwen3.5 9B has 2048, Gemma3 270M has 640 - it scales with model size), multiplying that with a vocabulary of 128k (sometimes 256k, sometimes even more). There are edge cases with vocab sizes in the millions, but even 128k is already large enough to dominate compute.

## Reframing: token prediction as retrieval 

The way we started thinking about it was:

> token prediction isn’t really classification, it is retrieval

In practice, the model isn’t “choosing between 128k classes” in the way a classifier would.
It’s more like: given a hidden state, which token in this large set is most relevant?

That’s much closer to an information retrieval problem:

- you have a query (the hidden state)
- and a corpus (the vocabulary)
- and you’re trying to find the best match

That shift in perspective is what led to the two-stage setup.

## What We Built

FlashHead uses a **two-stage retrieval** approach:

1. **Cluster assignment** - Map the hidden state to the nearest centroid 
2. **Token retrieval** - Within that cluster, find the actual token

This turns a `O(vocab)` operation into `O(num_clusters + num_probes * cluster_size)` and since `num_clusters + num_probes * cluster_size << vocab` the head latency drops.

## What Broke

### K-means that took forever

Our initial k-means setup was… kind of ridiculous in hindsight.

We let it run for **6–7 hours** on a GPU. We were using way too many random initializations just to ensure the resulting clusters are good. Turns out *~10 minutes* with fewer restarts produces equally good clusters.

### Variable latency

We started with standard k-means -> unbalanced clusters.

Unbalanced clusters seemed fine at first and we arelady saw speedups. But then we noticed latency varied depending on the prompt - some tokens fell into larger clusters, which meant more computation. This is bad for real-time applications where you need consistent latency.

This also made memory access patterns messy and less hardware-friendly. Switching to balanced clusters fixed that:

- same number of tokens evaluated every time
- consistent latency, independent of the prompt
- much cleaner memory access

Trade-off:

- slightly worse clustering quality

But for real systems, especially real-time ones, predictable latency and hardware-friendlyness (Triton kernels!) is just more important.

### Fixed Probes

We experimented with making the number of probes dynamic.

Idea was:

- use first-stage confidence
- then decide how many clusters to evaluate (e.g. cover 95% probability mass instead of fixed top-k)

In theory, that’s nicer. However, in practice:

- fixed number of probes worked just as well
- again, consistent token throughput is required
- no clear win from making it dynamic

Might matter in very specific setups, but we didn’t see a strong reason to complicate it.

### Quantization: accidental but important

Normally, the LM head is left unquantized because accuracy drops badly.

But with the two-stage setup, we noticed something:

- the **first matmul (centroids × hidden)** can actually be quantized
- without hurting accuracy

> This wasn’t planned at all, it came out of a random whiteboard discussion when we were thinking about hardware efficiency... It ended up being one of the more useful optimizations.

## Why this helps small models more

The overall speedup depends on how much the head contributes to latency.

For small models:

- vocab size stays large (~128k)
- hidden dimension is relatively small (~4k)

So the head becomes a **disproportionately large part of compute**.

In some cases, the head is ~50% of total latency.
That’s why we see up to **~2× speedup** for smaller models.
For larger models, the body dominates more, so the relative gain is smaller.

## Design philosophy (this guided most decisions)

FlashHead was developed with the product and practicability in real-world settings in mind. A lot of the choices we made weren’t just about theory, they were about deployment.

- predictable latency matters
- hardware efficiency matters
- clean memory access matters

That’s why things like:

- balanced clusters
- fixed probe counts
- selective quantization

ended up being the right trade-offs, even if they’re not always *“optimal”* in a pure ML sense.

## Key Numbers

- **4.85×** speedup on the classification head alone
- **1.75×** model-level speedup (Llama-3.2, Gemma-3, Qwen-3)
- Training-free - drop-in replacement, no fine-tuning needed
- Works with vLLM out of the box

---
title: "How to Prune Attention"
tags: ["Attention", "Pruning", "Vision Transformers", "Research"]
quote: "Good attention pruning removes structure the model is not using while preserving structure the compiler can still optimize."
kind: "deep-dive"
hook: "Attention pruning is about removing structured capacity from the attention block without collapsing the tensor layout that hardware and compilers expect. The main levers are heads, channels per head, and the shared embedding size."
keyPoints:
  - "Head pruning removes entire attention branches and is the cleanest structured change"
  - "Channel pruning keeps all heads but reduces width in the query, key, and value projections"
  - "Embedding-width pruning shrinks the shared representation that all heads draw from"
  - "Structured pruning is easier to accelerate than unstructured sparsity on most hardware"
  - "Each pruning axis has different accuracy and deployment tradeoffs"
related: ["optimizing-vision-transformers-for-peak-performance-on-nvidia-jetson-agx-orinvidia-jetson-agx-orin", "_gXU6T6DrWo", "8ZbgHLie4rI"]
---

# How to Prune Attention

Attention is the backbone of modern transformers, but it's also computationally expensive. Pruning attention can significantly reduce model size and latency while maintaining most of the accuracy.
In practice, attention pruning comes down to three levers:

- heads
- channels per head
- embedding size

Each of them behaves very differently once you actually deploy the model.

## Why Prune Attention?

If you look at attention in a real model, a few things usually show up:

- Some heads don’t do anything meaningful
- Q/K/V projections are often wider than necessary
- The embedding dimension is over-provisioned for smaller models

So there’s clear redundancy, but not all redundancy is equal.

Some of it you can remove cleanly.
Some of it breaks everything if you touch it.

## The Three Pruning Axes

### 1. Head Pruning

Removes entire attention branches. This is the **cleanest structured change** because:
- no weird tensor reshaping
- everything stays aligned
- compilers handle it well
- latency drops roughly in proportion to heads removed

In practice, this is usually the first and easiest thing to try.

The only real problem: *not all heads are useless*.

Some heads carry very specific signals (e.g. positional structure, long-range dependencies), so removing the wrong ones hurts quickly.

There are these papers ["Analyzing Multi-Head Self-Attention:
Specialized Heads Do the Heavy Lifting, the Rest Can Be Pruned""](https://arxiv.org/pdf/1905.09418) and ["Are Sixteen Heads Really Better than One?"](https://arxiv.org/abs/1905.10650) talking exactly about why head pruning works in Transformer models.

### 2. Channel Pruning

Instead of removing entire heads, you can prune structured channels in the Q, K, and V projections. This is more fine-grained than head pruning, but also more delicate (keyword: tensor dependencies):

- the reshaping into heads has to remain valid
- the output projection usually has to be updated too
- some implementations assume fixed head dimensions, so deployment can get awkward fast

So in theory it gives more control, but in practice it usually involves a bit more engineering than pure head pruning.

### 3. Embedding Size Pruning

This shrinks the shared embedding dimension that all heads use.

So instead of touching parts of attention, you’re compressing the entire representation. This has the biggest impact:

- every head is affected
- every layer downstream is affected

So it’s powerful—but easy to overdo. Usually this needs:

- tighter accuracy monitoring
- retraining or fine-tuning

## Hardware Considerations

In theory:

> any sparsity reduces compute

In practice:

> if the hardware can’t use it, it doesn’t matter

Structured pruning is generally easier to accelerate than unstructured sparsity because:
- Regular tensor shapes that compilers can optimize
- No special sparse formats needed (like 2:4 sparsity)
- Better memory access patterns

The key insight: **prune what the hardware can actually use**. A sparse model that can't be accelerated is useless.

## Trade-offs Summary

*This is not a strict rule, just how I experienced it to play out in practice.*

| Pruning Type | Accuracy Impact | Hardware Friendliness | Complexity |
|--------------|-----------------|----------------------|-------------|
| Head | Moderate | High | Low |
| Channel | Variable | Medium-High | Medium |
| Embedding | High | High | High |

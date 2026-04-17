---
title: "Cosmos-Reason2: On-Device Inference Report"
tags: ["Edge AI", "Quantization", "Jetson"]
image: "https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Cosmos-Reason2-2B__orin_nano_super.svg"
imageAlt: "Benchmark visualization for Cosmos-Reason2 on Jetson Orin Nano"
quote: "From OOM to running with near-zero accuracy loss."
kind: "blog"
hook: "Benchmark report for optimizing Cosmos-Reason2 (Qwen3-VL) on Jetson Orin Nano. From OOM to running with near-zero accuracy loss using mixed-precision quantization."
ctaLabel: "Open on HF"
keyPoints:
  - "Mixed-precision quantization: 4-bit weight, 8-bit activation"
  - "Sub-1W inference on edge"
  - "From OOM to running on Jetson Orin Nano"
---

# Cosmos-Reason2: On-Device Inference Report

Optimizing a VLM for edge deployment is fundamentally different from server-side optimization. Memory is tight, power is limited, and there's no room for swapping.

## The Challenge

Cosmos-Reason2 (2B params) is a vision-language model that was failing to run on Jetson Orin Nano:
- OOM errors immediately
- Default quantization wasn't working
- The model was too large for the edge

## What We Did

### 1. Mixed-Precision Quantization

We used a combination:
- **4-bit weights** for the bulk of the model
- **8-bit activation** for parts that needed precision
- **FP16** for critical operations like attention

The key insight: not all layers need the same precision. The attention computation needs more precision than the FFN layers.

### 2. Memory Management

We had to:
- Reduce batch size to 1
- Stream activations where possible
- Use INT4 for weights but INT8 for compute

### 3. Power Optimization

Target was sub-1W inference. We achieved this by:
- Using tensorrt optimization
- Reducing clock speeds where possible
- Batching where memory allowed

## Results

| Metric | Value |
|--------|-------|
| Latency | ~200ms per token |
| Power | < 1W |
| Accuracy loss | < 0.5% |

## Key Takeaways

1. **Quantization alone isn't enough** - You need proper memory management
2. **Layer-wise precision** - Different layers need different precision levels
3. **Hardware-aware optimization** - The compiler matters as much as the model

## Links

- [HuggingFace Space](https://huggingface.co/spaces/embedl/Edge-Inference-Benchmarks)
- [Full Report](https://huggingface.co/blog/JonnaMat/cosmos-reason2-report)
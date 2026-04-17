---
title: "Cosmos-Reason2: On-Device Inference Report"
tags: ["Edge AI", "Quantization", "Jetson"]
image: "https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Cosmos-Reason2-2B__orin_nano_super.svg"
imageAlt: "Benchmark visualization for Cosmos-Reason2 on Jetson Orin Nano"
quote: "We benchmarked accross modalities (text, image, video), NVIDIA hardware (Orin Nano Super, AGX Orin, AGX Thor), resolutions (1920x1080:FHD, 1280x720:HD, 854x480), with 6 and 12 frames, and single and batched concurrency and concurrency."
kind: "blog"
link: "https://huggingface.co/blog/JonnaMat/cosmos-reason2-report"
hook: "Benchmark report for optimizing Cosmos-Reason2 (Qwen3-VL) on Jetson Orin Nano. From OOM to running with near-zero accuracy loss using mixed-precision quantization."
ctaLabel: "Open on HF"
keyPoints:
  - "Mixed-precision quantization: 4-bit weight, 8-bit activation"
  - "Sub-1W inference on edge"
  - "From OOM to running on Jetson Orin Nano"
related: ["flashhead-deep-dive"]
---

# Cosmos-Reasson2: On-Device Inference Report



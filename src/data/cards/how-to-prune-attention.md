---
title: "How to Prune Attention"
tags: ["Attention", "Pruning", "Vision Transformers", "Research"]
image: "https://www.embedl.com/hubfs/Vision%20Transformers-min.png"
imageAlt: "Attention pruning deep dive for Vision Transformers"
quote: "Good attention pruning removes structure the model is not using while preserving structure the compiler can still optimize."
kind: "deep-dive"
hook: "Attention pruning is about removing structured capacity from the attention block without collapsing the tensor layout that hardware and compilers expect. The main levers are heads, channels per head, and the shared embedding width."
keyPoints:
  - "Head pruning removes entire attention branches and is the cleanest structured change"
  - "Channel pruning keeps all heads but reduces width in the query, key, and value projections"
  - "Embedding-width pruning shrinks the shared representation that all heads draw from"
  - "Structured pruning is easier to accelerate than unstructured sparsity on real hardware"
  - "Each pruning axis has different accuracy and deployment tradeoffs"
---

# How to Prune Attention

Attention is the backbone of modern transformers, but it's also computationally expensive. Pruning attention can significantly reduce model size and latency while maintaining most of the accuracy.

## Why Prune Attention?

The attention mechanism has three main components that can be pruned:

1. **Attention heads** - Some heads might be redundant or learned useless patterns
2. **Channels per head** - The Q, K, V projections can be narrower than needed
3. **Embedding width** - The shared representation can be compressed

## The Three Pruning Axes

### 1. Head Pruning

Removes entire attention branches. This is the cleanest structured change because:
- No tensor layout changes
- Easy for compilers to optimize
- Reduces computation proportionally to the number of removed heads

The trade-off: some heads might be doing useful things, so you need to be careful about which ones to remove.

### 2. Channel Pruning

Keeps all heads but reduces their width. Reduces the size of Q, K, V projections:
- More fine-grained than head pruning
- Requires careful accuracy monitoring
- Can be combined with quantization for better results

### 3. Embedding Width Pruning

Shrinks the shared representation that all heads draw from:
- Most aggressive on model capacity
- Affects every head simultaneously
- Usually needs tighter accuracy control

## Hardware Considerations

Structured pruning is generally easier to accelerate than unstructured sparsity because:
- Regular tensor shapes that compilers can optimize
- No special sparse formats needed
- Better memory access patterns

The key insight: **prune what the hardware can actually use**. A sparse model that can't be accelerated is useless.

## Trade-offs Summary

| Pruning Type | Accuracy Impact | Hardware Friendliness | Complexity |
|--------------|-----------------|----------------------|-------------|
| Head | Medium | High | Low |
| Channel | Low-Medium | High | Medium |
| Embedding | High | High | High |
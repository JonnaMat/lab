# Portfolio Fix Log

## Status: IN PROGRESS

## Goal
Transform portfolio from "try-hard and shallow" to "AI RESEARCHER" - technical notebook style.

---

## Deep Dives Completed

### 1. FlashHead ✓
- Added new "flashhead-deep-dive" card with engineering details
- Updated content.ts with: what broke, trade-offs, key insight
- Updated PreviewModal to display engineering panel (only for deep-dive with engineering content)
- Added SVG diagram from embedl/flash-head repo to FlashHead deep dive
- Made engineering notes more blog-post style (paragraphs instead of bullet lists)
- Fixed card summaries to be more human/lab report style
- Fixed button text to be more natural ("pruning deep dive", "flashhead notes", "read")
- Added Markdown frontmatter parsing (hook, keyPoints)
- Markdown rendering with custom styling for lists, blockquotes, headers
- First h1 hidden (duplicate of card title)
- Styled: blockquotes (purple border, background), lists (colored markers), headers

**Key engineering content added:**
- K-means: 6-7 hours → 10 min (too many random initializations)
- Balanced clusters fix variable latency
- Quantization discovered in whiteboard discussion (accidental)
- Fixed 256 probes, dynamic didn't show benefit
- Why head is bottleneck: vocab (128k) > hidden (4k), unquantizable

---

## Problems to Fix (In Order)

1. [x] FlashHead deep dive - DONE
2. [ ] Master's Thesis - needs deep dive
3. [ ] Edge Inference Benchmarks - needs deep dive
4. [ ] Vision Transformer case study - needs deep dive
5. [ ] Blog posts - add failures/iterations
6. [ ] Simplify/remove tech stack section
7. [ ] Create more deep dive cards (IR, K-means, quantization)

---

## Next: Master's Thesis Deep Dive
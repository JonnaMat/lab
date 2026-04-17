export interface CardData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  title: string;
  description: string;
  type: "article" | "demo";
  link: string;
  cardType?:
    | "article"
    | "award"
    | "github"
    | "arxiv"
    | "paper"
    | "space"
    | "youtube"
    | "case-study"
    | "deep-dive";
}

export interface Viewport {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface CanvasState {
  cards: CardData[];
  viewport: Viewport;
  maxZIndex: number;
  draggedCardId: string | null;
}

export const DEFAULT_CARDS: CardData[] = [
  // FlashHead

  {
    id: "c10",
    x: 1400,
    y: 200,
    zIndex: 1,
    title: "FlashHead: Accelerating Language Model Inference",
    description:
      "Post-training replacement for the dense classification head that reframes token prediction as retrieval. Up to 4.85× speedup without retraining.",
    type: "article",
    link: "https://huggingface.co/blog/JonnaMat/flashhead",
  },
  {
    id: "flashhead-dd",
    x: 1300,
    y: 350,
    zIndex: 1,
    title: "FlashHead: Research Notes",
    description:
      "Why the head is a bottleneck, what broke during development, and the trade-offs we hit.",
    type: "article",
    link: "flashhead-deep-dive",
    cardType: "deep-dive",
  },
  {
    id: "c12",
    x: 1500,
    y: 20,
    zIndex: 1,
    title: "flash-head",
    description: "vLLM plugin • embedl/flash-head",
    type: "article",
    link: "https://github.com/embedl/flash-head",
    cardType: "github",
  },
  {
    id: "c13",
    x: 1200,
    y: 80,
    zIndex: 1,
    title:
      "FlashHead: Efficient Drop-In Replacement for the Classification Head",
    description: "arXiv:2603.14591 • cs.LG",
    type: "article",
    link: "https://arxiv.org/abs/2603.14591",
    cardType: "arxiv",
  },
  // Master Thesis
  {
    id: "c19",
    x: 600,
    y: 880,
    zIndex: 1,
    title:
      "The Impact of Deep Neural Network Pruning on the Hyperparameter Performance Space",
    description: "Master's thesis • Chalmers & University of Gothenburg",
    type: "article",
    link: "https://hdl.handle.net/2077/78958",
    cardType: "paper",
  },
  {
    id: "c18",
    x: 850,
    y: 950,
    zIndex: 1,
    title: "Talk @ tinyML EMEA 2023",
    description:
      "Sensitivity Analysis of Hyperparameters in Deep Neural-Network Pruning",
    type: "demo",
    link: "https://www.youtube.com/watch?v=-dn0UR7iUyc",
    cardType: "youtube",
  },
  // Engineering
  {
    id: "c9",
    x: 1800,
    y: 500,
    zIndex: 1,
    title: "How to Build a vLLM Plugin",
    description:
      "Guide to vLLM's general_plugins entry point, covering architecture registration, monkey-patching, and FlashHead examples.",
    type: "article",
    link: "https://huggingface.co/blog/JonnaMat/how-to-vllm-plugin",
  },
  {
    id: "c17",
    x: 1950,
    y: 600,
    zIndex: 1,
    title: "huggingface-slack-app",
    description: "GitHub bots for Slack and HF integration",
    type: "article",
    link: "https://github.com/JonnaMat/huggingface-slack-app",
    cardType: "github",
  },
  // Case Studies
  {
    id: "c15",
    x: 25,
    y: 80,
    zIndex: 1,
    title: "Talk @ EdgeAI Foundation 2025",
    description: "The Optimization Trap in EdgeAI",
    type: "demo",
    link: "https://www.youtube.com/watch?v=_gXU6T6DrWo",
    cardType: "youtube",
  },
  {
    id: "c11",
    x: 300,
    y: 150,
    zIndex: 1,
    title: "Cosmos-Reason2: On-Device Inference Report",
    description:
      "Benchmark report for optimizing Cosmos-Reason2 on Jetson Orin Nano. From OOM to running with near-zero accuracy loss using mixed-precision quantization.",
    type: "article",
    link: "https://huggingface.co/blog/JonnaMat/cosmos-reason2-report",
  },
  {
    id: "c21",
    x: 540,
    y: 260,
    zIndex: 1,
    title:
      "Optimizing Vision Transformers for Peak Performance on NVIDIA Jetson AGX Orin",
    description:
      "Embedl case study on Jetson AGX Orin optimization for Vision Transformers.",
    type: "article",
    link: "https://www.embedl.com/optimizing-vision-transformers-for-peak-performance-on-nvidia-jetson-agx-orinvidia-jetson-agx-orin",
    cardType: "case-study",
  },
  {
    id: "c22",
    x: 780,
    y: 230,
    zIndex: 1,
    title: "How to Prune Attention",
    description:
      "Research explainer on pruning attention heads, channels per head, and embedding width.",
    type: "article",
    link: "how-to-prune-attention",
    cardType: "deep-dive",
  },
  {
    id: "c16",
    x: 200,
    y: 350,
    zIndex: 1,
    title: "Talk @ GAIA 2025",
    description:
      "Deploying Generative AI: Overcoming Challenges in Performance, Security, and Efficiency",
    type: "demo",
    link: "https://www.youtube.com/watch?v=8ZbgHLie4rI",
    cardType: "youtube",
  },
  // Research
  {
    id: "c14",
    x: 1000,
    y: 600,
    zIndex: 1,
    title: "Edge Inference Benchmarks",
    description: "Edge Inference Benchmarks for Qwen3.5 on NVIDIA AGX Orin",
    type: "demo",
    link: "https://huggingface.co/spaces/embedl/Edge-Inference-Benchmarks",
    cardType: "space",
  },
  {
    id: "c20",
    x: 1720,
    y: 860,
    zIndex: 1,
    title: "Grand Prize for Engineering - Rising Star",
    description: "Ny Teknik · Nov 2024",
    type: "article",
    link: "https://www.nyteknik.se/ingenjorsdagen/ais-storsta-flaskhals-och-hur-tekniken-kan-losa-den/4347835",
    cardType: "award",
  },
];

export const DEFAULT_VIEWPORT: Viewport = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

export const MAX_Z_INDEX = 1000;

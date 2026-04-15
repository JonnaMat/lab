export interface CardData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  title: string;
  description: string;
  type: 'article' | 'demo';
  link: string;
  cardType?: 'article' | 'github' | 'arxiv' | 'space' | 'youtube';
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
  {
    id: 'c13',
    x: 1200,
    y: 80,
    zIndex: 1,
    title: 'FlashHead: Efficient Drop-In Replacement for the Classification Head',
    description: 'arXiv:2603.14591 • cs.LG',
    type: 'article',
    link: 'https://arxiv.org/abs/2603.14591',
    cardType: 'arxiv',
  },
  {
    id: 'c9',
    x: 100,
    y: 100,
    zIndex: 1,
    title: 'How to Build a vLLM Plugin',
    description: 'Guide to vLLM\'s general_plugins entry point, covering architecture registration, monkey-patching, and FlashHead examples.',
    type: 'article',
    link: 'https://huggingface.co/blog/JonnaMat/how-to-vllm-plugin',
  },
  {
    id: 'c10',
    x: 500,
    y: 80,
    zIndex: 1,
    title: 'FlashHead: Accelerating Language Model Inference',
    description: 'Post-training replacement for the dense classification head that reframes token prediction as retrieval. Up to 4.85× speedup without retraining.',
    type: 'article',
    link: 'https://huggingface.co/blog/JonnaMat/flashhead',
  },
  {
    id: 'c11',
    x: 900,
    y: 60,
    zIndex: 1,
    title: 'Cosmos-Reason2: On-Device Inference Report',
    description: 'Benchmark report for optimizing Cosmos-Reason2 on Jetson Orin Nano. From OOM to running with near-zero accuracy loss using mixed-precision quantization.',
    type: 'article',
    link: 'https://huggingface.co/blog/JonnaMat/cosmos-reason2-report',
  },
  {
    id: 'c12',
    x: 100,
    y: 400,
    zIndex: 1,
    title: 'flash-head',
    description: 'vLLM plugin • embedl/flash-head',
    type: 'article',
    link: 'https://github.com/embedl/flash-head',
    cardType: 'github',
  },
  {
    id: 'c14',
    x: 100,
    y: 650,
    zIndex: 1,
    title: 'Edge Inference Benchmarks',
    description: 'Edge Inference Benchmarks for Qwen3.5 on NVIDIA AGX Orin',
    type: 'demo',
    link: 'https://huggingface.co/spaces/embedl/Edge-Inference-Benchmarks',
    cardType: 'space',
  },
  {
    id: 'c15',
    x: 500,
    y: 650,
    zIndex: 1,
    title: 'FlashHead Demo',
    description: 'FlashHead: Efficient drop-in replacement for dense classification head',
    type: 'demo',
    link: 'https://www.youtube.com/watch?v=_gXU6T6DrWo',
    cardType: 'youtube',
  },
  {
    id: 'c16',
    x: 700,
    y: 650,
    zIndex: 1,
    title: 'FlashHead Explained',
    description: 'Video explanation of FlashHead architecture',
    type: 'demo',
    link: 'https://www.youtube.com/watch?v=8ZbgHLie4rI',
    cardType: 'youtube',
  },
  {
    id: 'c17',
    x: 900,
    y: 650,
    zIndex: 1,
    title: 'huggingface-slack-app',
    description: 'GitHub bots for Slack and HF integration',
    type: 'article',
    link: 'https://github.com/JonnaMat/huggingface-slack-app',
    cardType: 'github',
  },
];

export const DEFAULT_VIEWPORT: Viewport = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

export const MAX_Z_INDEX = 1000;

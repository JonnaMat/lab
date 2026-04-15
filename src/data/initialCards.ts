export interface CardData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  title: string;
  description: string;
  type: 'article' | 'demo';
  link: string;
  cardType?: 'article' | 'github';
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
];

export const DEFAULT_VIEWPORT: Viewport = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

export const MAX_Z_INDEX = 1000;

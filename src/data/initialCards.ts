export interface CardData {
  id: string;
  x: number;
  y: number;
  zIndex: number;
  title: string;
  description: string;
  type: 'article' | 'demo';
  link: string;
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
    id: 'c1',
    x: 100,
    y: 100,
    zIndex: 1,
    title: 'Attention Is All You Need',
    description: 'The foundational Transformer paper that revolutionized NLP. Introduces self-attention mechanism.',
    type: 'article',
    link: '#transformer',
  },
  {
    id: 'c2',
    x: 450,
    y: 80,
    zIndex: 1,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    description: 'Bidirectional encoder representation from transformers. Sets new benchmarks in language understanding.',
    type: 'article',
    link: '#bert',
  },
  {
    id: 'c3',
    x: 250,
    y: 350,
    zIndex: 1,
    title: 'GPT-3: Language Models are Few-Shot Learners',
    description: 'Large-scale language model demonstrating emergent capabilities through in-context learning.',
    type: 'article',
    link: '#gpt3',
  },
  {
    id: 'c4',
    x: 600,
    y: 300,
    zIndex: 1,
    title: 'Chain-of-Thought Prompting',
    description: 'Interactive demo showing how intermediate reasoning steps improve LLM performance on complex tasks.',
    type: 'demo',
    link: '#cot-demo',
  },
  {
    id: 'c5',
    x: 150,
    y: 550,
    zIndex: 1,
    title: 'RLHF: Learning from Human Feedback',
    description: 'Training language models to align with human preferences using reinforcement learning.',
    type: 'article',
    link: '#rlhf',
  },
  {
    id: 'c6',
    x: 500,
    y: 520,
    zIndex: 1,
    title: 'Retrieval-Augmented Generation',
    description: 'Combining frozen language models with external knowledge retrieval for more factual outputs.',
    type: 'article',
    link: '#rag',
  },
  {
    id: 'c7',
    x: 750,
    y: 150,
    zIndex: 1,
    title: 'Mixture of Experts Scaling',
    description: 'Sparse activation in large models enables efficient scaling beyond dense model constraints.',
    type: 'article',
    link: '#moe',
  },
  {
    id: 'c8',
    x: 700,
    y: 450,
    zIndex: 1,
    title: ' Constitutional AI',
    description: 'Self-critique and alignment techniques using AI-generated feedback rather than human labels.',
    type: 'article',
    link: '#cai',
  },
];

export const DEFAULT_VIEWPORT: Viewport = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

export const MAX_Z_INDEX = 1000;

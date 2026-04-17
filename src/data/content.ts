export const articleContent: Record<string, {
  hook: string;
  quote?: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
  keyPoints?: string[];
  authors?: string[];
  subjects?: string[];
  published?: string;
  kind?: 'blog' | 'award' | 'case-study' | 'deep-dive';
  sourceLabel?: string;
  ctaLabel?: string;
}> = {
  '2603.14591': {
    hook: 'FlashHead reframes token prediction as a retrieval problem, achieving up to 1.75× model-level inference speedup while maintaining accuracy.',
    quote: 'Generating the next token is not a dense matrix multiplication problem; it is a retrieval problem.',
    tags: ['LLM Optimization', 'Inference', 'Information Retrieval'],
    authors: ['Wilhelm Tranheden', 'Shahnawaz Ahmed', 'Devdatt Dubhashi', 'Jonna Matthiesen', 'Hannes von Essen'],
    subjects: ['Machine Learning (cs.LG)', 'Artificial Intelligence (cs.AI)', 'Information Retrieval (cs.IR)'],
    published: 'Submitted on 15 Mar 2026',
    keyPoints: [
      'Training-free drop-in replacement for dense classification head',
      'Balanced clustering for hardware-efficient vocabulary partitioning',
      'Multi-probe retrieval enabling thousands of clusters in parallel',
      'Selective quantization for effective low-bit computation',
      '1.75× speedup on Llama-3.2, Gemma-3, and Qwen-3',
    ],
  },
  'how-to-vllm-plugin': {
    hook: 'A practical guide to building vLLM plugins using the general_plugins entry point. Covers architecture registration, monkey-patching internals, and real-world examples from FlashHead.',
    quote: '"Just pip install and run" was a distant dream.',
    tags: ['vLLM', 'Python', 'Plugin System'],
    keyPoints: [
      'Architecture registration via vllm.general_plugins',
      'Monkey-patching without source changes',
      'Real-world example with FlashHead',
    ],
  },
  'flashhead': {
    hook: 'FlashHead reframes token prediction as a retrieval problem. Achieves up to 4.85× speedup on the classification head alone, without retraining.',
    quote: 'Generating the next token is not a dense matrix multiplication problem; it is a retrieval problem.',
    tags: ['LLM Optimization', 'Inference', 'Edge AI'],
    keyPoints: [
      'Two-stage retrieval pipeline',
      'Training-free deployment',
      'Works with vLLM out of the box',
    ],
  },
  'cosmos-reason2-report': {
    hook: 'Benchmark report for optimizing Cosmos-Reason2 (Qwen3-VL) on Jetson Orin Nano. From OOM to running with near-zero accuracy loss.',
    image: 'https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Cosmos-Reason2-2B__orin_nano_super.svg',
    imageAlt: 'Benchmark visualization for Cosmos-Reason2 on Jetson Orin Nano',
    tags: ['Edge AI', 'Quantization', 'Jetson'],
    keyPoints: [
      'Mixed-precision quantization',
      '4-bit weight, 8-bit activation',
      'Sub-1W inference on edge',
    ],
  },
  '4347835': {
    kind: 'award',
    hook: 'Grand Prize for Engineering - Rising Star, issued by Ny Teknik in November 2024.',
    quote: 'As a role model for women in one of the most male-dominated areas of the tech industry, she shows how expertise, commitment and leadership can pave the way for new opportunities and inspire future generations. With her deep knowledge of computer science and mathematics, combined with her leadership and ability to think strategically, she has a key role in driving the development of the AI industry forward.',
    tags: ['Award', 'AI Industry', 'Leadership'],
    image: 'https://image.nyteknik.se/4347838.webp?imageId=4347838&x=0.00&y=7.18&cropw=100.00&croph=85.63&width=2116&height=1208&format=webp',
    imageAlt: 'Portrait from Ny Teknik article about the Rising Star engineering award',
    published: 'Issued in Nov 2024',
    sourceLabel: 'Ny Teknik',
    ctaLabel: 'Read article',
    keyPoints: [
      'Recognized for technical depth in computer science and mathematics',
      'Highlighted as a role model for women in AI and engineering',
      'Cited for leadership, strategic thinking, and industry impact',
    ],
  },
  'optimizing-vision-transformers-for-peak-performance-on-nvidia-jetson-agx-orinvidia-jetson-agx-orin': {
    kind: 'case-study',
    hook: 'Embedl optimized a Vision Transformer for NVIDIA Jetson AGX Orin using TensorRT, mixed-precision quantization, and structured pruning.',
    tags: ['Vision Transformers', 'Jetson', 'Optimization'],
    sourceLabel: 'Embedl',
    ctaLabel: 'Open case study',
    image: 'https://lh7-rt.googleusercontent.com/docsz/AD_4nXefT0lqOJqdusTxqfRSlDa05RPo6T3E_K9CiQtDzyv3Ue-PB3e70lCyhnxYQ0g4PdWYky6-Cd7li-EoiWEWQ0FnAHmheMXn9FAJ00cp21N46YpQZy_8-UCb_gN8YbUkqreJHTJ85GYG6R9tfUIePkM4RZpL?key=xvrY1hwx2wvGoJELuh9zZw',
    imageAlt: 'Vision Transformer on NVIDIA Jetson AGX Orin',
    keyPoints: [
      '2x end-to-end inference speedup on NVIDIA Jetson AGX Orin',
      'Low-bit integer quantization with critical structures kept in floating point',
      'Structured pruning tuned for Orin hardware characteristics',
      'Less than 1% accuracy drop after optimization',
    ],
    quote: 'We achieved a 2x speedup and over 2x less energy per inference with less than 1% accuracy drop.',
  },
  'how-to-prune-attention': {
    kind: 'deep-dive',
    hook: 'Attention pruning is about removing structured capacity from the attention block without collapsing the tensor layout that hardware and compilers expect. The main levers are heads, channels per head, and the shared embedding width.',
    tags: ['Attention', 'Pruning', 'Vision Transformers', 'Research'],
    image: 'https://www.embedl.com/hubfs/Vision%20Transformers-min.png',
    imageAlt: 'Attention pruning deep dive for Vision Transformers',
    sourceLabel: 'Research Deep Dive',
    keyPoints: [
      'Head pruning removes entire attention branches and is the cleanest structured change',
      'Channel pruning keeps all heads but reduces width in the query, key, and value projections',
      'Embedding-width pruning shrinks the shared representation that all heads draw from',
      'Structured pruning is easier to accelerate than unstructured sparsity on real hardware',
      'Each pruning axis has different accuracy and deployment tradeoffs',
    ],
    quote: 'Good attention pruning removes structure the model is not using while preserving structure the compiler can still optimize.',
  },
};

export const githubContent: Record<string, {
  description: string;
  features: string[];
  installCommand: string;
  mockDemo?: {
    avatar: string;
    user: string;
    userTag?: string;
    time?: string;
    title: string;
    body?: string;
    codeBlock?: string;
    modelLinks?: {
      name: string;
      downloads: number;
      hearts: number;
    }[];
    tags: string[];
    link: string;
    reactions?: {
      emoji: string;
      count: number;
      active?: boolean;
    }[];
  };
}> = {
  'embedl-flash-head': {
    description: 'Drop-in replacement for the LM head. Up to 2× model-level inference speedup while maintaining accuracy — training-free and hardware-friendly.',
    features: [
      'No source patches or custom Docker required',
      'Integrates via vLLM\'s official plugin entry point',
      'Supports greedy and sampling decoding',
      'Quantized model support out of the box',
    ],
    installCommand: 'pip install flash-head',
  },
  'JonnaMat-huggingface-slack-app': {
    description: 'Custom GitHub Slack bot integration with Hugging Face. Get GitHub notifications directly in Slack with customizable alerts.',
    features: [
      'Custom Slack bot for GitHub integration',
      'HF Spaces, models, and datasets notifications',
      'Pull request and issue notifications',
      'Configurable alert triggers',
    ],
    installCommand: 'pip install huggingface-slack-app',
    mockDemo: {
      avatar: 'https://avatars.githubusercontent.com/u/1463491',
      user: 'HuggingFace',
      userTag: 'App',
      title: '🎉 embedl released 2 new models!',
      body: '',
      modelLinks: [
        { name: 'embedl/gemma-3-1b-it-FlashHead-W4A16', downloads: 138, hearts: 3 },
        { name: 'embedl/Qwen3-1.7B-FlashHead-W4A16', downloads: 105, hearts: 3 },
      ],
      codeBlock: '/hf subscribe embedl/gemma-3-1b-it-FlashHead-W4A16\n/hf subscribe embedl/Qwen3-1.7B-FlashHead-W4A16',
      tags: ['Model Release', 'New'],
      link: 'https://huggingface.co/embedl',
      reactions: [
        { emoji: '❤️', count: 6, active: false },
        { emoji: '🎉', count: 3, active: false },
        { emoji: '🚀', count: 2, active: false },
      ],
    },
  },
};

export const paperContent: Record<string, {
  abstract?: string[];
}> = {
  '78958': {
    abstract: [
      'With the continued growth of deep learning models in terms of size and computational requirements, the need for efficient models for deployment on resource-constrained devices becomes crucial. Structured pruning has emerged as a proven method to speed up models and reduce computational requirements. Structured pruning involves removing filters, channels, or groups of operations from a network, effectively modifying its architecture. Since the optimal hyperparameters of a model are tightly coupled to its architecture, it is unclear how pruning affects the choice of hyperparameters. To answer this question, we investigate the impact of deep neural network pruning on the hyperparameter performance space.',
      'In this work, we perform a series of experiments on popular classification models, ResNet-56, MobileNetV2, and ResNet-50, using CIFAR-10 and ImageNet datasets. We examine the effect of uniform and non-uniform structured magnitude pruning on the learning rate and weight decay. Specifically, we explore how pruning affects their relationship and the risk associated with not tuning these hyperparameters after pruning. The experiments reveal that pruning does not have a significant impact on the learning rate and weight decay, suggesting that extensive hyperparameter tuning after pruning may not be crucial for optimal performance.',
      'Overall, this study provides insights into the complex dynamics between pruning, model performance, and optimal hyperparameters. The findings give guidance for optimising and fine-tuning pruned models and contribute to advancing model compression and hyperparameter tuning, highlighting the interplay between model architecture and hyperparameters.',
    ],
  },
};

export function getSlug(url: string): string {
  return url.replace('https://github.com/', '').replace(/\//g, '-');
}

export function getRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

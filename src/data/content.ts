export const articleContent: Record<string, {
  hook: string;
  quote?: string;
  tags: string[];
  image?: string;
  keyPoints?: string[];
  authors?: string[];
  subjects?: string[];
  published?: string;
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
    tags: ['Edge AI', 'Quantization', 'Jetson'],
    keyPoints: [
      'Mixed-precision quantization',
      '4-bit weight, 8-bit activation',
      'Sub-1W inference on edge',
    ],
  },
};

export const githubContent: Record<string, {
  description: string;
  features: string[];
  installCommand: string;
  mockDemo?: {
    avatar: string;
    user: string;
    time: string;
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
      user: 'huggingface[bot]',
      time: '2h ago',
      title: '🎉 embedl released 2 new models!',
      body: '',
      modelLinks: [
        { name: 'embedl/Cosmos-Reason2-2B-W4A16-Edge2-FlashHead', downloads: 730, hearts: 6 },
        { name: 'embedl/Cosmos-Reason2-2B-W4A16', downloads: 2304, hearts: 6 },
      ],
      codeBlock: '/hf subscribe embedl/Cosmos-Reason2-2B-W4A16-Edge2-FlashHead\n/hf subscribe embedl/Cosmos-Reason2-2B-W4A16',
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

export function getSlug(url: string): string {
  return url.replace('https://github.com/', '').replace(/\//g, '-');
}

export function getRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

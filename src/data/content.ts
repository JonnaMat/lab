export const articleContent: Record<string, {
  hook: string;
  quote?: string;
  tags: string[];
  image?: string;
  keyPoints?: string[];
}> = {
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
};

export function getSlug(url: string): string {
  return url.replace('https://github.com/', '').replace(/\//g, '-');
}

export function getRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

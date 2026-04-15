import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';

const articleContent: Record<string, { hook: string; quote?: string; image?: string; tags: string[] }> = {
  'how-to-vllm-plugin': {
    hook: 'A guide to vLLM\'s general_plugins entry point, covering how to build your own plugin with architecture registration, monkey-patching internals, and real-world examples from FlashHead.',
    quote: '"Just pip install and run" was a distant dream.',
    tags: ['vLLM', 'Python', 'Plugin System', 'LLM Inference'],
  },
  'flashhead': {
    hook: 'FlashHead is a post-training replacement for the dense classification head that reframes token prediction as a retrieval problem. Achieves up to 4.85× speedup on the head alone, without retraining.',
    quote: 'Generating the next token is not a dense matrix multiplication problem; it is a retrieval problem.',
    tags: ['LLM Optimization', 'Inference', 'Edge AI', 'Quantization'],
  },
  'cosmos-reason2-report': {
    hook: 'Benchmark report for optimizing Cosmos-Reason2 (Qwen3-VL) for on-device inference on the Jetson lineup. From OOM on Orin Nano to running with near-zero accuracy loss using mixed-precision quantization.',
    image: 'https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Cosmos-Reason2-2B__orin_nano_super.svg',
    tags: ['Edge AI', 'Quantization', 'Jetson', 'Multimodal'],
  },
};

const githubContent: Record<string, { description: string; features: string[]; installCommand: string }> = {
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

function getGitHubRepo(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function getGitHubSlug(url: string): string {
  return url.replace('https://github.com/', '').replace(/\//g, '-');
}

interface GitHubStats {
  stars: number;
  forks: number;
  language: string;
}

export function PreviewModal() {
  const previewCard = useCanvasStore((s) => s.previewCard);
  const closePreview = useCanvasStore((s) => s.closePreview);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);

  const isGitHub = previewCard?.cardType === 'github' || false;
  const repo = previewCard?.link ? getGitHubRepo(previewCard.link) : null;
  const githubSlug = previewCard?.link ? getGitHubSlug(previewCard.link) : '';
  const ghContent = githubContent[githubSlug];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
    };
    if (previewCard) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewCard, closePreview]);

  useEffect(() => {
    if (repo) {
      fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`)
        .then((r) => r.json())
        .then((data) => {
          setStats({
            stars: data.stargazers_count || 0,
            forks: data.forks_count || 0,
            language: data.language || 'Python',
          });
        })
        .catch(() => setStats(null));
    } else {
      setStats(null);
    }
  }, [repo]);

  if (!previewCard) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closePreview();
  };

  const content = articleContent[previewCard.link.split('/').pop() || ''];

  if (isGitHub) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/30 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-purple-500/20">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
                <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {previewCard.title}
                </h2>
                <p className="text-purple-400 font-mono text-sm">
                  {repo?.owner}/{repo?.repo}
                </p>
              </div>
            </div>

            {stats && (
              <div className="flex gap-6 mb-6 pb-6 border-b border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.stars.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Stars</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.forks.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Forks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stats.language}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Language</div>
                </div>
              </div>
            )}

            {ghContent?.description && (
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {ghContent.description}
              </p>
            )}

            {ghContent?.features && (
              <ul className="space-y-2 mb-6">
                {ghContent.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-black/30 rounded-xl p-4 mb-6 border border-white/10">
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Install</div>
              <code className="text-purple-400 font-mono text-sm">
                {ghContent?.installCommand || 'pip install ' + previewCard.title.toLowerCase().replace(/\s+/g, '-')}
              </code>
            </div>

            <a
              href={previewCard.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-dracula-bg rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden border border-dracula-bg-light flex flex-col">
        <div className="p-4 border-b border-dracula-bg-light shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs rounded-full bg-dracula-cyan/20 text-dracula-cyan border border-dracula-cyan/40">
              Article
            </span>
            {content?.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-dracula-foreground">
                {previewCard.title}
              </h2>
              <p className="text-dracula-comment text-xs">{new URL(previewCard.link).hostname}</p>
            </div>
            <a
              href={previewCard.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-dracula-bg bg-dracula-cyan hover:bg-dracula-cyan/80 rounded-lg transition-colors"
            >
              Open ↗
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {content && (
            <p className="text-dracula-foreground/80 leading-relaxed mb-4">
              {content.hook}
            </p>
          )}

          {content?.image && (
            <img
              src={content.image}
              alt="Visualization"
              className="w-full rounded-lg mb-4 bg-white"
            />
          )}

          {content?.quote && (
            <blockquote className="border-l-4 border-dracula-purple pl-4 py-2 mb-4 bg-dracula-bg-light/50 rounded-r-lg">
              <p className="text-dracula-purple font-medium italic">
                {content.quote}
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { articleContent, githubContent, getSlug, getRepo } from '../data/content';
import { GitHubIcon, ExternalLinkIcon, CheckIcon } from './Icons';

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

  const isGitHub = previewCard?.cardType === 'github';
  const repo = previewCard?.link ? getRepo(previewCard.link) : null;
  const slug = previewCard?.link?.split('/').pop() || '';
  const ghSlug = previewCard?.link ? getSlug(previewCard.link) : '';
  const content = articleContent[slug];
  const ghContent = githubContent[ghSlug];

  useEffect(() => {
    if (!repo) return;
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`)
      .then(r => r.json())
      .then(data => setStats({ stars: data.stargazers_count || 0, forks: data.forks_count || 0, language: data.language || 'Python' }))
      .catch(() => setStats(null));
  }, [repo]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closePreview(); };
    if (previewCard) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [previewCard, closePreview]);

  if (!previewCard) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closePreview();
  };

  if (isGitHub) {
    return (
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
        <div className="bg-[#282A36] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#BD93F9]/30">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#BD93F9] to-[#FF79C6] flex items-center justify-center shrink-0 shadow-lg shadow-[#BD93F9]/30">
                <GitHubIcon className="w-9 h-9 text-[#282A36]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#F8F8F2] mb-1">{previewCard.title}</h2>
                <p className="text-[#BD93F9] font-mono text-sm">{repo?.owner}/{repo?.repo}</p>
              </div>
            </div>

            {stats && (
              <div className="flex gap-6 mb-6 pb-6 border-b border-white/10">
                <div className="text-center"><div className="text-2xl font-bold text-white">{stats.stars.toLocaleString()}</div><div className="text-xs text-gray-400 uppercase">Stars</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-white">{stats.forks.toLocaleString()}</div><div className="text-xs text-gray-400 uppercase">Forks</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-white">{stats.language}</div><div className="text-xs text-gray-400 uppercase">Language</div></div>
              </div>
            )}

            {ghContent?.description && <p className="text-lg text-[#F8F8F2]/80 leading-relaxed mb-6">{ghContent.description}</p>}

            {ghContent?.features && (
              <ul className="space-y-2 mb-6">
                {ghContent.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#F8F8F2]/80">
                    <CheckIcon className="w-5 h-5 text-[#BD93F9] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <div className="bg-[#21222C] rounded-xl p-4 mb-6 border border-[#343746]">
              <div className="text-xs text-[#6272A4] mb-2 uppercase tracking-wide">Install</div>
              <code className="text-[#BD93F9] font-mono text-sm">{ghContent?.installCommand || `pip install ${previewCard.title.toLowerCase().replace(/\s+/g, '-')}`}</code>
            </div>

            <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] hover:opacity-90 text-[#282A36] font-semibold rounded-xl transition-all shadow-lg shadow-[#BD93F9]/25">
              <GitHubIcon className="w-5 h-5" /> View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
      <div className="bg-[#282A36] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-[#8BE9FD]/30">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Article</span>
                {content?.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-[#FFB86C]/20 text-[#FFB86C] border border-[#FFB86C]/30">{tag}</span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-[#F8F8F2] leading-tight">{previewCard.title}</h2>
            </div>
            <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FFD21E] bg-[#FFD21E]/10 border border-[#FFD21E]/30 rounded-lg hover:bg-[#FFD21E]/20 transition-colors">
              <ExternalLinkIcon /> Open on HF
            </a>
          </div>

          {content?.image && (
            <div className="mb-6 rounded-xl overflow-hidden border border-[#343746]">
              <img src={content.image} alt="Benchmark visualization" className="w-full" />
            </div>
          )}

          {content?.hook && <p className="text-[#F8F8F2]/80 leading-relaxed mb-4 text-lg">{content.hook}</p>}

          {content?.quote && (
            <blockquote className="border-l-4 border-[#BD93F9] pl-4 py-2 mb-6 bg-[#BD93F9]/10 rounded-r-lg">
              <p className="text-[#BD93F9] font-medium italic text-lg">{content.quote}</p>
            </blockquote>
          )}

          {content?.keyPoints && (
            <ul className="space-y-2 mb-6">
              {content.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[#F8F8F2]/80">
                  <CheckIcon className="w-5 h-5 text-[#50FA7B] shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

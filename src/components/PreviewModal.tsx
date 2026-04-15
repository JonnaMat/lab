import { useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { articleContent, githubContent, getSlug, getRepo } from '../data/content';
import { GitHubIcon, ExternalLinkIcon, CheckIcon, ArxivIcon } from './Icons';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  return <span>{display.toLocaleString()}{suffix}</span>;
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
  const [modelStats, setModelStats] = useState<Record<string, { downloads: number; likes: number }>>({});
  const [activeReactions, setActiveReactions] = useState<Set<string>>(new Set());

  const isGitHub = previewCard?.cardType === 'github';
  const isArxiv = previewCard?.cardType === 'arxiv';
  const isYoutube = previewCard?.cardType === 'youtube';
  const repo = previewCard?.link ? getRepo(previewCard.link) : null;
  const slug = previewCard?.link?.split('/').pop() || '';
  const ghSlug = previewCard?.link ? getSlug(previewCard.link) : '';
  const content = articleContent[slug];
  const ghContent = githubContent[ghSlug];
  const mockDemo = ghContent?.mockDemo;

  useEffect(() => {
    if (!repo) return;
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`)
      .then(r => r.json())
      .then(data => setStats({ stars: data.stargazers_count || 0, forks: data.forks_count || 0, language: data.language || 'Python' }))
      .catch(() => setStats(null));
  }, [repo]);

  useEffect(() => {
    if (!mockDemo?.modelLinks) return;
    const fetchModelStats = async () => {
      for (const model of mockDemo.modelLinks!) {
        try {
          const res = await fetch(`https://huggingface.co/api/models/${model.name}`);
          const data = await res.json();
          setModelStats(prev => ({
            ...prev,
            [model.name]: { downloads: data.downloads || 0, likes: data.likes || 0 }
          }));
        } catch {
          setModelStats(prev => ({
            ...prev,
            [model.name]: { downloads: model.downloads, likes: model.hearts }
          }));
        }
      }
    };
    fetchModelStats();
  }, [mockDemo?.modelLinks]);

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
                <div className="text-center"><div className="text-2xl font-bold text-white"><AnimatedNumber value={stats.stars} /></div><div className="text-xs text-gray-400 uppercase">Stars</div></div>
                <div className="text-center"><div className="text-2xl font-bold text-white"><AnimatedNumber value={stats.forks} /></div><div className="text-xs text-gray-400 uppercase">Forks</div></div>
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

            {ghContent?.mockDemo && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-[#6272A4] uppercase tracking-wide">Slack Demo</div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-500">Live</span>
                  </div>
                </div>
                <div className="bg-[#0d1a1c] rounded-xl p-4 border border-[#1c9dae]">
                  <div className="flex items-start gap-3 relative z-10">
                    <img src={ghContent.mockDemo.avatar} alt="" className="w-10 h-10 rounded-full mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">{ghContent.mockDemo.user}</span>
                        <span className="text-white/40 text-xs">· {ghContent.mockDemo.time}</span>
                      </div>
                      {ghContent.mockDemo.title && (
                        <div className="text-white font-medium text-sm mb-2">{ghContent.mockDemo.title}</div>
                      )}
                      {ghContent.mockDemo.body && (
                        <div className="text-white text-sm whitespace-pre-wrap leading-relaxed mb-2">{ghContent.mockDemo.body}</div>
                      )}
                      {ghContent.mockDemo.modelLinks && (
                        <div className="space-y-1 mb-3">
                          {ghContent.mockDemo.modelLinks.map((model, i) => {
                            const stats = modelStats[model.name];
                            return (
                              <div key={i}>
                                <a
                                  href={`https://huggingface.co/${model.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#1c9dae] hover:underline font-mono"
                                >
                                  {model.name}
                                </a>
                                <div className="text-xs text-white/50 mt-0.5">
                                  <span><AnimatedNumber value={stats?.downloads || model.downloads} /> downloads</span>
                                  <span className="mx-1.5">·</span>
                                  <span><AnimatedNumber value={stats?.likes || model.hearts} /> ❤️</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {ghContent.mockDemo.codeBlock && (
                        <div className="bg-[#0a0e10] rounded-lg p-3 mb-3 font-mono text-xs text-[#1c9dae] border border-[#1c9dae]/30">
                          {ghContent.mockDemo.codeBlock}
                        </div>
                      )}
                      {ghContent.mockDemo.reactions && (
                        <div className="flex items-center gap-2">
                          {ghContent.mockDemo.reactions.map((reaction, i) => {
                            const isActive = activeReactions.has(reaction.emoji);
                            const count = reaction.count + (isActive ? 1 : 0);
                            return (
                              <button
                                key={i}
                                onClick={() => setActiveReactions(prev => { const next = new Set(prev); isActive ? next.delete(reaction.emoji) : next.add(reaction.emoji); return next; })}
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-all ${
                                  isActive ? 'bg-[#1c9dae]/30 border-[#1c9dae] text-[#1c9dae]' : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'
                                }`}
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-xs">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#BD93F9] to-[#FF79C6] hover:opacity-90 text-[#282A36] font-semibold rounded-xl transition-all shadow-lg shadow-[#BD93F9]/25">
              <GitHubIcon className="w-5 h-5" /> View on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isYoutube) {
    let videoId = '';
    if (previewCard?.link.includes('embed/')) {
      videoId = previewCard.link.split('/').pop() || '';
    } else if (previewCard?.link.includes('watch?v=')) {
      videoId = previewCard.link.split('v=').pop() || '';
    } else {
      videoId = previewCard?.link.split('/').pop() || '';
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
          <iframe
            src={embedUrl}
            title={previewCard?.title}
            className="w-full aspect-video rounded-xl shadow-2xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  if (isArxiv) {
    const pdfUrl = `https://arxiv.org/pdf/${slug}`;
    
    return (
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleOverlayClick}>
        <div className="bg-[#282A36] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-[#FFB86C]/30 flex flex-col">
          <div className="p-6 border-b border-[#343746]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <ArxivIcon className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-[#FFB86C]/20 text-[#FFB86C] border border-[#FFB86C]/30">arXiv Paper</span>
                    {content?.subjects?.slice(0, 2).map(subj => (
                      <span key={subj} className="px-2 py-0.5 text-xs rounded-full bg-[#F1FA8C]/20 text-[#F1FA8C] border border-[#F1FA8C]/30">{subj.split(' ')[0]}</span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-[#F8F8F2] leading-tight">{previewCard.title}</h2>
                </div>
              </div>
              <button onClick={closePreview} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            {content?.authors && (
              <div className="mb-3">
                <p className="text-sm text-[#6272A4]">
                  <span className="text-[#FFB86C] font-medium">{content.authors.join(', ')}</span>
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-[#6272A4] mb-4">
              {content?.published && <span>{content.published}</span>}
              <span className="font-mono text-[#FFB86C]">arXiv:{slug}</span>
            </div>
            
            {content?.hook && <p className="text-[#F8F8F2]/80 leading-relaxed text-sm mb-4">{content.hook}</p>}
            
            <div className="flex gap-3">
              <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#282A36] bg-gradient-to-r from-[#FFB86C] to-[#F1FA8C] rounded-lg hover:opacity-90 transition-opacity">
                <ExternalLinkIcon className="w-4 h-4" /> View on arXiv
              </a>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FFB86C] bg-[#FFB86C]/10 border border-[#FFB86C]/30 rounded-lg hover:bg-[#FFB86C]/20 transition-colors">
                Download PDF
              </a>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <iframe 
              src={pdfUrl} 
              className="w-full h-[60vh]"
              title="PDF Viewer"
            />
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
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Blog Post</span>
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

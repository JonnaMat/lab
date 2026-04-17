import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { articleContent, githubContent, paperContent, getSlug, getRepo } from '../data/content';
import { GitHubIcon, ExternalLinkIcon, CheckIcon, ArxivIcon, AwardIcon, PaperIcon } from './Icons';
import hfLogo from '../assets/hf-logo.svg';

interface GitHubStats {
  stars: number;
  forks: number;
  language: string;
}

type PruningMode = 'heads' | 'channels' | 'embedding';

const pruningModes: PruningMode[] = ['heads', 'channels', 'embedding'];

const pruningContent: Record<PruningMode, {
  label: string;
  title: string;
  summary: string;
  impact: string;
}> = {
  heads: {
    label: 'Heads',
    title: 'Remove whole attention heads',
    summary: 'This zeros out complete head groups, reducing parallel attention branches while keeping the remaining heads unchanged.',
    impact: 'Best when some heads contribute little and can be removed as an entire structured block.',
  },
  channels: {
    label: 'Channels / head',
    title: 'Trim width inside each head',
    summary: 'This prunes channels from the query, key, and value tensors inside every head instead of removing the full head.',
    impact: 'Useful when attention is still valuable, but each head is wider than the hardware really benefits from.',
  },
  embedding: {
    label: 'Embedding size',
    title: 'Shrink the shared embedding dimension',
    summary: 'This removes slices across the embedding width that all heads depend on, shrinking the model more globally.',
    impact: 'Most aggressive on model width, but it affects every head at once and usually needs tighter accuracy control.',
  },
};

function isPrunedCell(mode: PruningMode, row: number, col: number) {
  if (mode === 'heads') return col >= 6;
  if (mode === 'channels') return col % 3 === 2;
  return row < 2;
}

function TransformerPruningExplorer() {
  const [activeMode, setActiveMode] = useState<PruningMode>('heads');
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  useEffect(() => {
    if (!isAutoCycling) return;

    const interval = window.setInterval(() => {
      setActiveMode((current) => pruningModes[(pruningModes.indexOf(current) + 1) % pruningModes.length]);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isAutoCycling]);

  const current = pruningContent[activeMode];

  return (
    <section className="case-study-panel mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="case-study-kicker">Transformer Pruning</p>
          <h3 className="surface-title text-xl mb-2">{current.title}</h3>
          <p className="surface-subtle text-sm leading-relaxed max-w-xl">{current.summary}</p>
        </div>
        <div className="case-study-legend shrink-0">
          <span className="case-study-legend-item">
            <span className="case-study-legend-swatch case-study-legend-swatch-active" />
            unchanged
          </span>
          <span className="case-study-legend-item">
            <span className="case-study-legend-swatch case-study-legend-swatch-pruned" />
            zeros / removed
          </span>
        </div>
      </div>

      <div className="case-study-toggle-group mt-4 mb-5">
        {pruningModes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setActiveMode(mode);
              setIsAutoCycling(false);
            }}
            className={`case-study-toggle ${activeMode === mode ? 'case-study-toggle-active' : ''}`}
          >
            {pruningContent[mode].label}
          </button>
        ))}
      </div>

      <div className="case-study-diagram">
        <div className="case-study-cube-stack" aria-hidden="true">
          {[2, 1, 0].map((layer) => (
            <div
              key={layer}
              className="case-study-cube-layer"
              style={{ ['--layer-index' as '--layer-index']: layer } as CSSProperties}
            >
              {Array.from({ length: 36 }).map((_, index) => {
                const row = Math.floor(index / 9);
                const col = index % 9;
                const isPruned = isPrunedCell(activeMode, row, col);

                return (
                  <span
                    key={`${layer}-${row}-${col}`}
                    className={`case-study-cell ${isPruned ? 'case-study-cell-pruned' : 'case-study-cell-active'}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="case-study-axis-label case-study-axis-x">
          {activeMode === 'embedding' ? 'shared embedding width' : 'inner embedding size'}
        </div>
        <div className="case-study-axis-label case-study-axis-y">
          {activeMode === 'embedding' ? 'embedding slices' : 'embedding size'}
        </div>
        <div className="case-study-axis-label case-study-axis-z">
          {activeMode === 'heads' ? 'heads' : activeMode === 'channels' ? 'channels per head' : 'seq. length'}
        </div>
      </div>

      <p className="case-study-impact mt-4">{current.impact}</p>
    </section>
  );
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (value < 5 || hasAnimated.current) {
      setDisplay(value);
      prevValue.current = value;
      if (value >= 5) hasAnimated.current = true;
      return;
    }
    
    hasAnimated.current = true;
    const start = prevValue.current;
    const end = value;
    const duration = 1500;
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

export function PreviewModal() {
  const previewCard = useCanvasStore((s) => s.previewCard);
  const closePreview = useCanvasStore((s) => s.closePreview);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [modelStats, setModelStats] = useState<Record<string, { downloads: number; likes: number; lastModified: string }>>({});
  const [activeReactions, setActiveReactions] = useState<Set<string>>(new Set());
  const [timeAgo, setTimeAgo] = useState('');

  const isGitHub = previewCard?.cardType === 'github';
  const isArxiv = previewCard?.cardType === 'arxiv';
  const isAward = previewCard?.cardType === 'award';
  const isPaper = previewCard?.cardType === 'paper';
  const isYoutube = previewCard?.cardType === 'youtube';
  const repo = previewCard?.link ? getRepo(previewCard.link) : null;
  const slug = previewCard?.link?.split('/').pop() || '';
  const ghSlug = previewCard?.link ? getSlug(previewCard.link) : '';
  const content = articleContent[slug];
  const isCaseStudy = previewCard?.cardType === 'case-study' || content?.kind === 'case-study';
  const isDeepDive = previewCard?.cardType === 'deep-dive' || content?.kind === 'deep-dive';
  const paperDetails = paperContent[slug];
  const ghContent = githubContent[ghSlug];
  const mockDemo = ghContent?.mockDemo;
  const firstModelName = mockDemo?.modelLinks?.[0]?.name;

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
            [model.name]: { downloads: data.downloads || 0, likes: data.likes || 0, lastModified: data.lastModified || '' }
          }));
        } catch {
          setModelStats(prev => ({
            ...prev,
            [model.name]: { downloads: model.downloads, likes: model.hearts, lastModified: '' }
          }));
        }
      }
    };
    fetchModelStats();
  }, [mockDemo?.modelLinks]);

  useEffect(() => {
    if (!firstModelName || !modelStats[firstModelName]?.lastModified) return;
    const lastMod = new Date(modelStats[firstModelName].lastModified);
    const now = new Date();
    const diffMs = now.getTime() - lastMod.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) setTimeAgo(`${diffMins}m ago`);
    else if (diffMins < 1440) setTimeAgo(`${Math.floor(diffMins / 60)}h ago`);
    else setTimeAgo(`${Math.floor(diffMins / 1440)}d ago`);
  }, [modelStats, firstModelName]);

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
      <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-surface modal-surface-github">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="hero-gradient-github w-16 h-16 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-dracula-purple/30">
                <GitHubIcon className="w-9 h-9 text-dracula-bg" />
              </div>
              <div>
                <h2 className="surface-title text-2xl mb-1">{previewCard.title}</h2>
                <p className="text-dracula-purple font-mono text-sm">{repo?.owner}/{repo?.repo}</p>
              </div>
            </div>

            {stats && (
              <div className="flex gap-6 mb-6 pb-6 border-b border-dracula-comment/30">
                <div className="text-center"><div className="surface-title text-2xl"><AnimatedNumber value={stats?.stars || 0} /></div><div className="text-xs text-dracula-comment uppercase">Stars</div></div>
                <div className="text-center"><div className="surface-title text-2xl"><AnimatedNumber value={stats?.forks || 0} /></div><div className="text-xs text-dracula-comment uppercase">Forks</div></div>
                <div className="text-center"><div className="surface-title text-2xl">{stats?.language || '-'}</div><div className="text-xs text-dracula-comment uppercase">Language</div></div>
              </div>
            )}

            {ghContent?.description && <p className="surface-subtle text-lg leading-relaxed mb-6">{ghContent.description}</p>}

            {ghContent?.features && (
              <ul className="space-y-2 mb-6">
                {ghContent.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 surface-subtle">
                    <CheckIcon className="w-5 h-5 text-dracula-purple shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {ghContent?.mockDemo && (
              <div className="mb-6">
                <div className="bg-dracula-selection rounded-xl p-4 border border-dracula-comment">
                  <div className="flex items-start gap-3 relative z-10">
                    <img src={hfLogo} alt="" className="w-10 h-10 rounded-full mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-dracula-foreground font-medium text-sm">{ghContent.mockDemo.user}</span>
                        {ghContent.mockDemo.userTag && (
                          <span className="badge badge-purple px-1.5 py-0.5 text-[10px]">{ghContent.mockDemo.userTag}</span>
                        )}
                        <span className="text-dracula-comment text-xs">· {timeAgo}</span>
                      </div>
                      {ghContent.mockDemo.title && (
                        <div className="text-dracula-foreground font-medium text-sm mb-2">{ghContent.mockDemo.title}</div>
                      )}
                      {ghContent.mockDemo.body && (
                        <div className="text-dracula-foreground text-sm whitespace-pre-wrap leading-relaxed mb-2">{ghContent.mockDemo.body}</div>
                      )}
                      {ghContent.mockDemo.modelLinks && (
                        <div className="space-y-1 mb-3">
                          {ghContent.mockDemo.modelLinks.map((model, i) => {
                            const stats = modelStats[model.name];
                            return (
                              <div key={i} className="flex items-center gap-2">
                                <a
                                  href={`https://huggingface.co/${model.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-dracula-purple hover:underline font-mono"
                                >
                                  {model.name}
                                </a>
                                <span className="text-xs text-dracula-comment">
                                  <AnimatedNumber value={stats?.downloads || model.downloads} /> downloads
                                </span>
                                <span className="text-dracula-comment">·</span>
                                <span className="text-xs text-dracula-comment">
                                  <AnimatedNumber value={stats?.likes || model.hearts} /> ❤️
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {ghContent.mockDemo.codeBlock && (
                        <div className="code-panel mb-3">
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
                                className={`reaction-pill ${
                                  isActive ? 'reaction-pill-active' : 'reaction-pill-inactive'
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
              className="button-primary button-primary-purple w-full rounded-xl shadow-lg shadow-dracula-purple/25">
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
      <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
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
      <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-surface modal-surface-paper flex">
          <div className="p-6 modal-header-divider">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="logo-badge w-14 h-14 rounded-xl">
                  <ArxivIcon className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge badge-orange">arXiv Paper</span>
                    {content?.subjects?.slice(0, 2).map(subj => (
                      <span key={subj} className="badge badge-yellow">{subj}</span>
                    ))}
                  </div>
                  <h2 className="surface-title text-xl leading-tight">{previewCard.title}</h2>
                </div>
              </div>
              <button onClick={closePreview} className="close-button">&times;</button>
            </div>
            
            {content?.authors && (
              <div className="mb-3">
                <p className="text-sm text-dracula-comment">
                  <span className="text-dracula-orange font-medium">{content.authors.join(', ')}</span>
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-xs text-dracula-comment mb-4">
              {content?.published && <span>{content.published}</span>}
              <span className="font-mono text-dracula-orange">arXiv:{slug}</span>
            </div>
            
            {content?.hook && <p className="surface-subtle leading-relaxed text-sm mb-4">{content.hook}</p>}
            
            <div className="flex gap-3">
              <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
                className="button-primary button-primary-orange">
                <ExternalLinkIcon className="w-4 h-4" /> View on arXiv
              </a>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                download={`${slug}.pdf`}
                className="button-secondary-orange">
                Open PDF
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

  if (isPaper) {
    return (
      <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-surface modal-surface-paper flex">
          <div className="p-6 modal-header-divider">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="logo-badge w-14 h-14 rounded-xl">
                  <PaperIcon className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge badge-orange">Paper</span>
                  </div>
                  <h2 className="surface-title text-xl leading-tight">{previewCard.title}</h2>
                </div>
              </div>
              <button onClick={closePreview} className="close-button">&times;</button>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-dracula-comment mb-4">
              <span className="font-mono text-dracula-orange">{previewCard.description}</span>
            </div>

            {paperDetails?.abstract && (
              <div className="mb-6 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-dracula-yellow">Abstract</h3>
                {paperDetails.abstract.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-relaxed surface-subtle">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
                className="button-primary button-primary-orange">
                <ExternalLinkIcon className="w-4 h-4" /> View Paper
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isAward) {
    return (
      <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-surface modal-surface-award">
          {content?.image && (
            <div className="relative h-64 modal-header-divider">
              <img src={content.image} alt={content.imageAlt || previewCard.title} className="w-full h-full object-cover" />
              <div className="media-fade-bottom-soft" />
              <div className="absolute top-5 left-5 flex items-center gap-3">
                <div className="icon-panel icon-panel-yellow w-14 h-14 rounded-2xl">
                  <AwardIcon className="w-7 h-7" />
                </div>
                <span className="badge badge-yellow px-3 py-1 text-sm">Engineering Award</span>
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="badge badge-yellow">{content?.sourceLabel || 'Award'}</span>
                  {content?.published && (
                    <span className="badge badge-cyan">{content.published}</span>
                  )}
                </div>
                <h2 className="surface-title text-2xl leading-tight">{previewCard.title}</h2>
              </div>
              <button onClick={closePreview} className="close-button">&times;</button>
            </div>

            {content?.hook && <p className="surface-strong-subtle leading-relaxed mb-5 text-lg">{content.hook}</p>}

            {content?.quote && (
              <blockquote className="quote-panel-yellow mb-6">
                <p className="text-dracula-foreground italic leading-relaxed">{content.quote}</p>
              </blockquote>
            )}

            {content?.keyPoints && (
              <ul className="space-y-2 mb-6">
                {content.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 surface-subtle">
                    <CheckIcon className="w-5 h-5 text-dracula-yellow shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
              className="button-primary button-primary-yellow">
              <ExternalLinkIcon className="w-4 h-4" /> {content?.ctaLabel || 'Read more'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  const articleBadgeLabel = isDeepDive ? 'Deep Dive' : isCaseStudy ? 'Case Study' : 'Blog Post';
  const articleBadgeClass = isDeepDive ? 'badge badge-purple' : isCaseStudy ? 'badge badge-orange' : 'badge badge-cyan';
  const articleModalClass = isDeepDive ? 'modal-surface modal-surface-deep-dive' : isCaseStudy ? 'modal-surface modal-surface-case-study' : 'modal-surface modal-surface-blog';
  const articleActionClass = isCaseStudy ? 'button-secondary-orange shrink-0' : 'button-secondary-yellow shrink-0';
  const articleQuoteClass = isDeepDive ? 'quote-panel-purple mb-6' : isCaseStudy ? 'quote-panel-yellow mb-6' : 'quote-panel-purple mb-6';
  const articleQuoteTextClass = isDeepDive ? 'text-dracula-purple font-medium italic text-lg' : isCaseStudy ? 'text-dracula-yellow font-medium italic text-lg' : 'text-dracula-purple font-medium italic text-lg';
  const articleCheckIconClass = isDeepDive ? 'w-5 h-5 text-dracula-purple shrink-0 mt-0.5' : isCaseStudy ? 'w-5 h-5 text-dracula-orange shrink-0 mt-0.5' : 'w-5 h-5 text-dracula-green shrink-0 mt-0.5';
  const showArticleAction = !isDeepDive;

  return (
    <div ref={overlayRef} className="modal-overlay" onClick={handleOverlayClick}>
      <div className={articleModalClass}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={articleBadgeClass}>{articleBadgeLabel}</span>
                {content?.tags.map(tag => (
                  <span key={tag} className="badge badge-orange">{tag}</span>
                ))}
              </div>
              <h2 className="surface-title text-2xl leading-tight">{previewCard.title}</h2>
            </div>
            {showArticleAction && (
              <a href={previewCard.link} target="_blank" rel="noopener noreferrer"
                className={articleActionClass}>
                <ExternalLinkIcon /> {content?.ctaLabel || 'Open on HF'}
              </a>
            )}
          </div>

          {content?.image && (
            <div className="mb-6 rounded-xl overflow-hidden border border-dracula-bg-light">
              <img src={content.image} alt={content.imageAlt || previewCard.title} className="w-full" />
            </div>
          )}

          {content?.hook && <p className="surface-subtle leading-relaxed mb-4 text-lg">{content.hook}</p>}

          {content?.quote && (
            <blockquote className={articleQuoteClass}>
              <p className={articleQuoteTextClass}>{content.quote}</p>
            </blockquote>
          )}

          {isDeepDive && <TransformerPruningExplorer />}

          {content?.keyPoints && (
            <ul className="space-y-2 mb-6">
              {content.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3 surface-subtle">
                  <CheckIcon className={articleCheckIconClass} />
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

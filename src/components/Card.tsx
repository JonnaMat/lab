import { useRef } from 'react';
import { CardData } from '../data/initialCards';
import { articleContent as articleMeta } from '../data/content';
import { useCardDrag } from '../hooks/useCardDrag';
import { useCanvasStore } from '../store/canvasStore';
import { ArxivIcon, AwardIcon, PaperIcon, GitHubLogoIcon } from './Icons';

const articleSummaries: Record<string, { summary: string; authors?: string[] }> = {
  'how-to-vllm-plugin': { summary: 'How we built a vLLM plugin without touching the source code.' },
  'flashhead': { summary: 'Retrieval instead of classification for the LM head. 4.85× speedup, no retraining.' },
  'cosmos-reason2-report': { summary: 'Took a VLM from OOM to running on Jetson Orin Nano. 4-bit quantization, sub-1W.' },
  'optimizing-vision-transformers-for-peak-performance-on-nvidia-jetson-agx-orinvidia-jetson-agx-orin': { summary: 'Pruning and quantizing ViT for Orin. 2× speedup, <1% accuracy drop.' },
  'how-to-prune-attention': { summary: 'Head pruning, channel pruning, embedding pruning. Which one actually works on hardware.' },
  '2603.14591': { summary: 'Replacing the dense classification head with retrieval. 1.75× model-level speedup.' },
  '4347835': { summary: 'Ny Teknik Rising Star award for engineering.' },
  'flashhead-deep-dive': { summary: 'K-means took 6 hours. Balanced clusters were an accident. Why heads are the bottleneck.' },
};

const smallCardLogoBadgeClass = 'w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0 p-0';
const smallCardLogoClass = 'w-6 h-6 object-scale-down';
const baseCardClass = 'card-surface';
const elevatedCardClass = 'card-surface absolute';
const interactiveCardStateClass = 'hover:card-shadow-hover hover:scale-102';
const draggableCardClass = `${interactiveCardStateClass}`;
const cardContentTitleClass = 'surface-title text-sm leading-tight';
const cardDividerClass = 'surface-divider pt-2';

export function Card({ card, isDraggingAnother }: { card: CardData; isDraggingAnother: boolean }) {
  const hoverTimeout = useRef<number | null>(null);
  const { isDragging, hasMoved, handleMouseDown, currentPos } = useCardDrag(card.id);
  const bringToFront = useCanvasStore((s) => s.bringToFront);

  const handleMouseEnter = () => {
    hoverTimeout.current = window.setTimeout(() => bringToFront(card.id), 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    useCanvasStore.getState().openPreview(card);
  };

  const style = {
    transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
    zIndex: card.zIndex,
  };

  if (card.cardType === 'arxiv') {
    const slug = card.link.split('/').pop() || '';
    const content = articleSummaries[slug];

    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-72 ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={smallCardLogoBadgeClass}>
              <ArxivIcon className={smallCardLogoClass} />
            </div>
            <span className="text-xs text-dracula-orange font-mono">{card.description}</span>
          </div>
          <h3 className={`${cardContentTitleClass} mb-2`}>{card.title}</h3>
          {content?.authors && (
            <p className="text-xs text-dracula-comment line-clamp-1 mb-2">{content.authors.slice(0, 3).join(', ')} {content.authors.length > 3 ? `+${content.authors.length - 3}` : ''}</p>
          )}
          <div className={cardDividerClass}>
            <button className="action-link action-link-orange" onClick={handleReadMoreClick}>
              View Paper →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'paper') {
    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-80 ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={smallCardLogoBadgeClass}>
              <PaperIcon className={smallCardLogoClass} />
            </div>
            <span className="text-xs text-dracula-orange font-mono">{card.description}</span>
          </div>
          <h3 className={`${cardContentTitleClass} mb-2`}>{card.title}</h3>
          <div className={cardDividerClass}>
            <button className="action-link action-link-orange" onClick={handleReadMoreClick}>
              View Paper →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'github') {
    return (
      <div
        data-card-id={card.id}
        className={`${elevatedCardClass} w-64 ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={smallCardLogoBadgeClass}>
              <GitHubLogoIcon className={smallCardLogoClass} />
            </div>
            <span className="text-xs text-dracula-comment font-mono">{card.description}</span>
          </div>
          <h3 className={`${cardContentTitleClass} mb-2`}>{card.title}</h3>
          <div className={cardDividerClass}>
            <button className="action-link action-link-purple" onClick={handleReadMoreClick}>
              Learn more →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'space') {
    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-[28rem] group ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <a href={card.link} target="_blank" rel="noopener" className="block relative">
          <img
            src="https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Qwen3.5__agx_orin.svg"
            alt={card.title}
            className="w-full h-auto min-h-[7rem] group-hover:opacity-80 transition-opacity"
          />
          <div className="media-fade-bottom-strong" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="badge badge-yellow gap-1 px-2 py-1">
              Open on HF
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className={cardContentTitleClass}>{card.title}</h3>
          </div>
        </a>
      </div>
    );
  }

  if (card.cardType === 'youtube') {
    let videoId = '';
    if (card.link.includes('embed/')) {
      videoId = card.link.split('/').pop() || '';
    } else if (card.link.includes('watch?v=')) {
      videoId = card.link.split('v=').pop() || '';
    } else {
      videoId = card.link.split('/').pop() || '';
    }
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    const handleYoutubeClick = (e: React.MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        handleReadMoreClick(e);
      }
    };

    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-80 group ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="relative aspect-video" onClick={handleYoutubeClick}>
          <img
            src={thumbnail}
            alt={card.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-dracula-red/90 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-600 text-white">YouTube</div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'award') {
    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-80 group ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="relative h-40 overflow-hidden">
          <img
            src="https://image.nyteknik.se/4347838.webp?imageId=4347838&x=0.00&y=7.18&cropw=100.00&croph=85.63&width=2116&height=1208&format=webp"
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="media-fade-bottom-soft" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="icon-panel icon-panel-yellow w-9 h-9 rounded-lg">
              <AwardIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <span className="text-xs text-dracula-orange font-mono">{card.description}</span>
          <h3 className={`${cardContentTitleClass} mt-2 mb-2`}>{card.title}</h3>
          <p className="text-xs text-dracula-comment line-clamp-2 mb-3">{articleSummaries['4347835'].summary}</p>
          <div className={cardDividerClass}>
            <button className="action-link action-link-yellow" onClick={handleReadMoreClick}>
              View award →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'case-study') {
    const slug = card.link.split('/').pop() || '';
    const content = articleMeta[slug];
    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-72 group ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        {content?.image && (
          <div className="relative h-28 overflow-hidden">
            <img
              src={content.image}
              alt={content.imageAlt || card.title}
              className="w-full h-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="media-fade-top" />
            <div className="absolute top-2 right-2">
              <span className="badge badge-orange">Case Study</span>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`${cardContentTitleClass} flex-1`}>{card.title}</h3>
            {!content?.image && <span className="badge badge-orange shrink-0">Case Study</span>}
          </div>

          <p className="text-xs text-dracula-comment line-clamp-2 mb-2">{articleSummaries['optimizing-vision-transformers-for-peak-performance-on-nvidia-jetson-agx-orinvidia-jetson-agx-orin'].summary}</p>

          <div className={cardDividerClass}>
            <button className="action-link action-link-orange" onClick={handleReadMoreClick}>
              View case study →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (card.cardType === 'deep-dive') {
    const slug = card.link.split('/').pop() || '';
    const content = articleMeta[slug];
    const summary = articleSummaries[slug]?.summary || content?.hook || '';
    return (
      <div
        data-card-id={card.id}
        className={`${baseCardClass} w-72 group ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        {content?.image && (
          <div className="relative h-28 overflow-hidden">
            <img
              src={content.image}
              alt={content.imageAlt || card.title}
              className="w-full h-full object-cover opacity-45 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="media-fade-top" />
            <div className="absolute top-2 right-2">
              <span className="badge badge-purple">Deep Dive</span>
            </div>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`${cardContentTitleClass} flex-1`}>{card.title}</h3>
            {!content?.image && <span className="badge badge-purple shrink-0">Deep Dive</span>}
          </div>

          <p className="text-xs text-dracula-comment line-clamp-2 mb-2">{summary}</p>

          <div className={cardDividerClass}>
            <button className="action-link action-link-purple" onClick={handleReadMoreClick}>
              {slug === 'how-to-prune-attention' ? 'pruning deep dive' : slug === 'flashhead-deep-dive' ? 'flashhead notes' : 'read'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const slug = card.link.split('/').pop() || '';
  const content = articleSummaries[slug];
  const isImageCard = slug === 'cosmos-reason2-report';

  return (
    <div
      data-card-id={card.id}
      className={`${baseCardClass} w-72 ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} ${draggableCardClass}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
      onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
      onClick={handleClick}
    >
      {isImageCard && (
        <div className="relative h-28 overflow-hidden">
          <img
            src="https://huggingface.co/datasets/embedl/documentation-images/resolve/main/Edge-Inference-Benchmarks/Cosmos-Reason2-2B__orin_nano_super.svg"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="media-fade-top" />
          <div className="absolute top-2 right-2">
            <span className="badge badge-cyan">Blog Post</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`${cardContentTitleClass} flex-1`}>{card.title}</h3>
          {!isImageCard && (
            <span className="badge badge-cyan shrink-0">Blog Post</span>
          )}
        </div>

        {content?.summary && !isImageCard && (
          <p className="text-xs text-dracula-comment line-clamp-2 mb-2">{content.summary}</p>
        )}

        <div className={cardDividerClass}>
          <button className="action-link action-link-cyan" onClick={handleReadMoreClick}>
            Read more →
          </button>
        </div>
      </div>
    </div>
  );
}

import { useRef } from 'react';
import { CardData } from '../data/initialCards';
import { useCardDrag } from '../hooks/useCardDrag';
import { useCanvasStore } from '../store/canvasStore';
import { ArxivIcon, PaperIcon, GitHubLogoIcon } from './Icons';

const articleContent: Record<string, { summary: string; authors?: string[] }> = {
  'how-to-vllm-plugin': { summary: 'A practical guide to building vLLM plugins using the general_plugins entry point.' },
  'flashhead': { summary: 'Reframes token prediction as a retrieval problem for faster LLM inference.' },
  'cosmos-reason2-report': { summary: 'Benchmark report for optimizing Cosmos-Reason2 on Jetson Orin Nano.' },
  '2603.14591': { summary: 'Training-free drop-in replacement for dense classification head. Up to 1.75× inference speedup.' },
};

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
    const content = articleContent[slug];

    return (
      <div
        data-card-id={card.id}
        className={`absolute w-72 rounded-xl cursor-pointer select-none overflow-hidden bg-[#282A36]/90 border border-[#FFB86C]/30
          ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <ArxivIcon className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#FFB86C] font-mono">{card.description}</span>
          </div>
          <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight mb-2">{card.title}</h3>
          {content?.authors && (
            <p className="text-xs text-[#6272A4] line-clamp-1 mb-2">{content.authors.slice(0, 3).join(', ')} {content.authors.length > 3 ? `+${content.authors.length - 3}` : ''}</p>
          )}
          <div className="pt-2 border-t border-[#343746]">
            <button className="text-xs text-[#FFB86C] hover:text-[#F1FA8C] transition-colors font-medium" onClick={handleReadMoreClick}>
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
        className={`absolute w-80 rounded-xl cursor-pointer select-none overflow-hidden bg-[#282A36]/90 border border-[#FFB86C]/30
          ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <PaperIcon className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#FFB86C] font-mono">{card.description}</span>
          </div>
          <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight mb-2">{card.title}</h3>
          <div className="pt-2 border-t border-[#343746]">
            <button className="text-xs text-[#FFB86C] hover:text-[#F1FA8C] transition-colors font-medium" onClick={handleReadMoreClick}>
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
        className={`absolute w-64 rounded-xl cursor-pointer select-none bg-[#282A36]/90 border border-[#BD93F9]/30
          ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102`}
        style={style}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => !isDraggingAnother && handleMouseEnter()}
        onMouseLeave={() => !isDraggingAnother && handleMouseLeave()}
        onClick={handleClick}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
              <GitHubLogoIcon className="w-6 h-6" />
            </div>
            <span className="text-xs text-[#6272A4] font-mono">{card.description}</span>
          </div>
          <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight mb-2">{card.title}</h3>
          <div className="pt-2 border-t border-[#343746]">
            <button className="text-xs text-[#BD93F9] hover:text-[#FF79C6] transition-colors font-medium" onClick={handleReadMoreClick}>
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
        className={`absolute w-[28rem] rounded-xl cursor-pointer select-none overflow-hidden bg-[#282A36]/90 border border-[#F1FA8C]/30
          ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102 group`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#282A36] via-[#282A36]/60 to-transparent" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#F1FA8C]/20 text-[#F1FA8C] border border-[#F1FA8C]/30">
              Open on HF
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight">{card.title}</h3>
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
        className={`absolute w-80 rounded-xl cursor-pointer select-none overflow-hidden bg-[#282A36]/90 border border-[#FF5555]/30
          ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102 group`}
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
            <div className="w-12 h-12 rounded-full bg-[#FF5555]/90 flex items-center justify-center shadow-lg">
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

  const slug = card.link.split('/').pop() || '';
  const content = articleContent[slug];
  const isImageCard = slug === 'cosmos-reason2-report';

  return (
    <div
      data-card-id={card.id}
      className={`absolute w-72 rounded-xl cursor-pointer select-none overflow-hidden bg-[#282A36]/90 border border-[#8BE9FD]/20
        ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'} hover:card-shadow-hover hover:scale-102`}
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#282A36]" />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Blog Post</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight flex-1">{card.title}</h3>
          {!isImageCard && (
            <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Blog Post</span>
          )}
        </div>

        {content?.summary && !isImageCard && (
          <p className="text-xs text-[#6272A4] line-clamp-2 mb-2">{content.summary}</p>
        )}

        <div className="pt-2 border-t border-[#343746]">
          <button className="text-xs text-[#8BE9FD] hover:text-[#50FA7B] transition-colors font-medium" onClick={handleReadMoreClick}>
            Read more →
          </button>
        </div>
      </div>
    </div>
  );
}

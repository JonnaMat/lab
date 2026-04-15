import { useRef } from 'react';
import { CardData } from '../data/initialCards';
import { useCardDrag } from '../hooks/useCardDrag';
import { useCanvasStore } from '../store/canvasStore';
import { GitHubIcon } from './Icons';

const articleContent: Record<string, { summary: string }> = {
  'how-to-vllm-plugin': { summary: 'A practical guide to building vLLM plugins using the general_plugins entry point.' },
  'flashhead': { summary: 'Reframes token prediction as a retrieval problem for faster LLM inference.' },
  'cosmos-reason2-report': { summary: 'Benchmark report for optimizing Cosmos-Reason2 on Jetson Orin Nano.' },
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

  if (card.cardType === 'github') {
    return (
      <div
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BD93F9] to-[#FF79C6] flex items-center justify-center">
              <GitHubIcon className="w-4 h-4 text-[#282A36]" />
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

  const slug = card.link.split('/').pop() || '';
  const content = articleContent[slug];
  const isImageCard = slug === 'cosmos-reason2-report';

  return (
    <div
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
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Article</span>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-[#F8F8F2] text-sm leading-tight flex-1">{card.title}</h3>
          {!isImageCard && (
            <span className="shrink-0 px-2 py-0.5 text-xs rounded-full bg-[#8BE9FD]/20 text-[#8BE9FD] border border-[#8BE9FD]/30">Article</span>
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

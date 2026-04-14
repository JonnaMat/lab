import { useRef, useCallback } from 'react';
import { CardData } from '../data/initialCards';
import { useCardDrag } from '../hooks/useCardDrag';
import { useCanvasStore } from '../store/canvasStore';

interface CardProps {
  card: CardData;
  isDraggingAnother: boolean;
}

export function Card({ card, isDraggingAnother }: CardProps) {
  const hoverTimeout = useRef<number | null>(null);
  const { isDragging, hasMoved, handleMouseDown, currentPos } = useCardDrag(
    card.id
  );
  const bringToFront = useCanvasStore((s) => s.bringToFront);

  const handleMouseEnter = useCallback(() => {
    hoverTimeout.current = window.setTimeout(() => {
      bringToFront(card.id);
    }, 150);
  }, [card.id, bringToFront]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [hasMoved]
  );

  const badgeClass = card.type === 'demo'
    ? 'bg-dracula-purple/20 text-dracula-purple border border-dracula-purple/40'
    : 'bg-dracula-cyan/20 text-dracula-cyan border border-dracula-cyan/40';

  return (
    <div
      className={`absolute w-72 bg-dracula-bg rounded-lg p-4 cursor-pointer select-none
        will-change-transform border border-dracula-bg-light
        ${isDragging ? 'card-shadow-drag scale-105' : 'card-shadow-base'}
        hover:card-shadow-hover hover:scale-102`}
      style={{
        transform: `translate(${currentPos.x}px, ${currentPos.y}px)`,
        zIndex: card.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={!isDraggingAnother ? handleMouseEnter : undefined}
      onMouseLeave={!isDraggingAnother ? handleMouseLeave : undefined}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-dracula-foreground text-sm leading-tight">
          {card.title}
        </h3>
        <span
          className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${badgeClass}`}
        >
          {card.type === 'demo' ? 'Demo' : 'Article'}
        </span>
      </div>
      <p className="text-xs text-dracula-foreground/70 leading-relaxed line-clamp-3">
        {card.description}
      </p>
      <div className="mt-3 pt-2 border-t border-dracula-bg-light">
        <span className="text-xs text-dracula-cyan hover:text-dracula-green transition-colors">
          Read more →
        </span>
      </div>
    </div>
  );
}

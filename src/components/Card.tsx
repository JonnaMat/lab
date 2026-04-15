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

  const handleReadMoreClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (card.link && card.link !== '#') {
        const openPreview = useCanvasStore.getState().openPreview;
        openPreview(card);
      }
    },
    [card]
  );

  if (card.cardType === 'github') {
    return (
      <div
        className={`absolute w-64 bg-gradient-to-br from-dracula-bg to-dracula-bg-light rounded-lg cursor-pointer select-none
          border border-dracula-purple/30
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
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-dracula-purple" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="text-xs text-dracula-comment font-mono">
              {card.description}
            </span>
          </div>
          <h3 className="font-semibold text-dracula-foreground text-sm leading-tight mb-3">
            {card.title}
          </h3>
          <div className="pt-2 border-t border-dracula-bg-light/50">
            <span
              className="text-xs text-dracula-purple hover:text-dracula-pink transition-colors cursor-pointer font-medium"
              onClick={handleReadMoreClick}
            >
              View README →
            </span>
          </div>
        </div>
      </div>
    );
  }

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
        <span
          className="text-xs text-dracula-cyan hover:text-dracula-green transition-colors cursor-pointer"
          onClick={handleReadMoreClick}
        >
          Read more →
        </span>
      </div>
    </div>
  );
}

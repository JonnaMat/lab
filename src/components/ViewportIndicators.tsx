import { useMemo } from 'react';
import { useCanvasStore } from '../store/canvasStore';

const CARD_WIDTH = 288;
const CARD_HEIGHT = 150;

export function ViewportIndicators() {
  const { cards, viewport } = useCanvasStore();

  const edges = useMemo(() => {
    if (typeof window === 'undefined' || cards.length === 0) return [];

    const W = window.innerWidth;
    const H = window.innerHeight;
    const { offsetX, offsetY, scale } = viewport;

    const result: string[] = [];

    const hasLeft = cards.some(card => card.x * scale + offsetX < 0);
    const hasRight = cards.some(card => (card.x + CARD_WIDTH) * scale + offsetX > W);
    const hasTop = cards.some(card => card.y * scale + offsetY < 0);
    const hasBottom = cards.some(card => (card.y + CARD_HEIGHT) * scale + offsetY > H);

    if (hasLeft) result.push('left');
    if (hasRight) result.push('right');
    if (hasTop) result.push('top');
    if (hasBottom) result.push('bottom');

    return result;
  }, [viewport.offsetX, viewport.offsetY, viewport.scale, cards]);

  if (edges.length === 0) return null;

  const positions: Record<string, object> = {
    left: { left: 8, top: '50%', transform: 'translateY(-50%)' },
    right: { right: 8, top: '50%', transform: 'translateY(-50%)' },
    top: { top: 8, left: '50%', transform: 'translateX(-50%)' },
    bottom: { bottom: 8, left: '50%', transform: 'translateX(-50%)' },
  };

  const symbols: Record<string, string> = {
    left: '<',
    right: '>',
    top: '^',
    bottom: 'v',
  };

  return (
    <>
      {edges.map((side) => (
        <div
          key={side}
          className="absolute pointer-events-none z-50 text-dracula-cyan/50 text-2xl font-light"
          style={positions[side]}
        >
          {symbols[side]}
        </div>
      ))}
    </>
  );
}

import { useEffect, useRef, useCallback, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';

const DRAG_THRESHOLD = 5;

export function useCardDrag(cardId: string) {
  const [isDragging, setIsDragging] = useState(false);
  const [visualPos, setVisualPos] = useState({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const startOffset = useRef({ x: 0, y: 0 });

  const card = useCanvasStore((s) => s.cards.find((c) => c.id === cardId));
  const viewport = useCanvasStore((s) => s.viewport);
  const { updateCardPosition, finalizeDrag, setDragging, bringToFront } =
    useCanvasStore();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || !card) return;
      e.stopPropagation();
      e.preventDefault();

      const { offsetX, offsetY, scale } = viewport;
      const cardScreenX = card.x * scale + offsetX;
      const cardScreenY = card.y * scale + offsetY;
      startOffset.current = {
        x: e.clientX - cardScreenX,
        y: e.clientY - cardScreenY,
      };
      hasMoved.current = false;
      setVisualPos({ x: card.x, y: card.y });
      setIsDragging(true);
      setDragging(cardId);
      bringToFront(cardId);
    },
    [card, cardId, setDragging, bringToFront, viewport]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const { offsetX, offsetY, scale } = viewport;
      const screenX = e.clientX - startOffset.current.x;
      const screenY = e.clientY - startOffset.current.y;
      const newX = (screenX - offsetX) / scale;
      const newY = (screenY - offsetY) / scale;
      setVisualPos({ x: newX, y: newY });

      if (
        !hasMoved.current &&
        card &&
        (Math.abs(newX - card.x) > DRAG_THRESHOLD ||
          Math.abs(newY - card.y) > DRAG_THRESHOLD)
      ) {
        hasMoved.current = true;
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        if (hasMoved.current) {
          updateCardPosition(cardId, visualPos.x, visualPos.y);
          finalizeDrag(cardId);
        }
        setIsDragging(false);
        setDragging(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, card, cardId, visualPos, setDragging, updateCardPosition, finalizeDrag, viewport]);

  const currentPos = isDragging ? visualPos : { x: card?.x ?? 0, y: card?.y ?? 0 };

  return {
    isDragging,
    hasMoved: hasMoved.current,
    handleMouseDown,
    currentPos,
  };
}

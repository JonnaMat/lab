import { useRef, useEffect, useState } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { Card } from './Card';
import { ResetButton } from './ResetButton';
import { ViewportIndicators } from './ViewportIndicators';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { cards, viewport, loadFromCookie, pan, zoom, draggedCardId } = useCanvasStore();
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [panCount, setPanCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    loadFromCookie();
  }, [loadFromCookie]);

  useEffect(() => {
    setShowHint(panCount < 3);
  }, [panCount]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      zoom(delta, e.clientX, e.clientY);
    };

    const canvasEl = canvasRef.current;
    if (canvasEl) {
      canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (canvasEl) {
        canvasEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [zoom]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning.current) {
        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        pan(deltaX, deltaY);
      }
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [pan]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPanCount((c) => c + 1);
    e.preventDefault();
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-dracula-bg-dark canvas-grid">
        <div
          ref={canvasRef}
          className={`absolute inset-0 ${
            isPanning.current ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleCanvasMouseDown}
        >
          <div
            className="relative w-[1400px] h-[900px]"
          style={{
            transform: `translate3d(${viewport.offsetX}px, ${viewport.offsetY}px, 0) scale(${viewport.scale})`,
            willChange: 'transform',
            transformOrigin: '0 0',
            shapeRendering: 'geometricPrecision',
          }}
        >
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isDraggingAnother={!!draggedCardId && draggedCardId !== card.id}
            />
          ))}
        </div>
      </div>

      {showHint && (
        <div className="fixed top-4 left-4 bg-dracula-bg-light/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-dracula-comment/30">
          <p className="text-xs text-dracula-foreground/80">
            Drag canvas to pan
          </p>
        </div>
      )}

      <div className="fixed bottom-3 md:bottom-4 left-3 md:left-4 text-xs text-dracula-comment/60">
        © 2026 Jonna Matthiesen — <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-dracula-foreground/80">CC BY 4.0</a>
      </div>

      <ResetButton />
      <ViewportIndicators />
    </div>
  );
}

import { useEffect } from 'react';
import { useCanvasStore } from '../store/canvasStore';

export function ResetButton() {
  const reset = useCanvasStore((s) => s.reset);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        reset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  return (
    <button
      onClick={reset}
      className="fixed bottom-3 right-3 md:bottom-6 md:right-6 px-4 py-2 bg-dracula-purple text-dracula-bg font-medium text-sm rounded-lg
        hover:bg-dracula-pink transition-colors shadow-lg z-[9999]
        border border-dracula-purple/50"
      title="Reset layout (Esc)"
    >
      Reset Layout
    </button>
  );
}

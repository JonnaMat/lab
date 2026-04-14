import Cookies from 'js-cookie';
import { create } from 'zustand';
import { CardData, DEFAULT_CARDS, DEFAULT_VIEWPORT, MAX_Z_INDEX } from '../data/initialCards';

const COOKIE_KEY = 'spatial-canvas-layout';
const COOKIE_EXPIRY = 30;

interface CanvasStore {
  cards: CardData[];
  viewport: { offsetX: number; offsetY: number; scale: number };
  draggedCardId: string | null;
  maxZIndex: number;
  loadFromCookie: () => void;
  saveToCookie: () => void;
  clearCookie: () => void;
  bringToFront: (cardId: string) => void;
  updateCardPosition: (cardId: string, x: number, y: number) => void;
  finalizeDrag: (cardId: string) => void;
  setDragging: (cardId: string | null) => void;
  pan: (deltaX: number, deltaY: number) => void;
  zoom: (delta: number, mouseX?: number, mouseY?: number) => void;
  reset: () => void;
}

const loadCardsFromCookie = (): CardData[] | null => {
  const saved = Cookies.get(COOKIE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  cards: DEFAULT_CARDS,
  viewport: DEFAULT_VIEWPORT,
  draggedCardId: null,
  maxZIndex: 1,

  loadFromCookie: () => {
    const savedCards = loadCardsFromCookie();
    if (savedCards) {
      set({ cards: savedCards });
    }
  },

  saveToCookie: () => {
    const { cards } = get();
    Cookies.set(COOKIE_KEY, JSON.stringify(cards), { expires: COOKIE_EXPIRY });
  },

  clearCookie: () => {
    Cookies.remove(COOKIE_KEY);
  },

  bringToFront: (cardId: string) => {
    const { cards, maxZIndex, draggedCardId } = get();
    if (draggedCardId) return;

    const newMaxZ = Math.min(maxZIndex + 1, MAX_Z_INDEX);
    set({
      cards: cards.map((c) => (c.id === cardId ? { ...c, zIndex: newMaxZ } : c)),
      maxZIndex: newMaxZ,
    });
  },

  updateCardPosition: (cardId: string, x: number, y: number) => {
    const { cards, maxZIndex } = get();
    const newMaxZ = Math.min(maxZIndex + 1, MAX_Z_INDEX);
    set({
      cards: cards.map((c) =>
        c.id === cardId ? { ...c, x, y, zIndex: newMaxZ } : c
      ),
      maxZIndex: newMaxZ,
    });
  },

  finalizeDrag: (_cardId: string) => {
    get().saveToCookie();
  },

  setDragging: (cardId: string | null) => {
    set({ draggedCardId: cardId });
  },

  pan: (deltaX: number, deltaY: number) => {
    const { viewport } = get();
    set({
      viewport: {
        ...viewport,
        offsetX: viewport.offsetX + deltaX,
        offsetY: viewport.offsetY + deltaY,
      },
    });
  },

  zoom: (delta: number, mouseX?: number, mouseY?: number) => {
    const { viewport } = get();
    const oldScale = viewport.scale;
    const newScale = Math.min(Math.max(oldScale + delta, 0.5), 2);
    
    if (mouseX !== undefined && mouseY !== undefined) {
      const canvasX = (mouseX - viewport.offsetX) / oldScale;
      const canvasY = (mouseY - viewport.offsetY) / oldScale;
      const newOffsetX = mouseX - canvasX * newScale;
      const newOffsetY = mouseY - canvasY * newScale;
      set({
        viewport: {
          offsetX: newOffsetX,
          offsetY: newOffsetY,
          scale: newScale,
        },
      });
    } else {
      set({
        viewport: {
          ...viewport,
          scale: newScale,
        },
      });
    }
  },

  reset: () => {
    set({
      cards: DEFAULT_CARDS.map((c) => ({ ...c })),
      viewport: DEFAULT_VIEWPORT,
      maxZIndex: 1,
      draggedCardId: null,
    });
    get().clearCookie();
  },
}));

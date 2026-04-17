import { useEffect, useState } from 'react';
import { ArrowAnnotation } from '../store/canvasStore';

const OVERLAY_BOUNDS = {
  minX: -1000,
  minY: -1000,
  width: 4000,
  height: 3000,
};

const DEFAULT_ARROW_COLOR = 'var(--dracula-comment)';

interface ArrowOverlayProps {
  annotations: ArrowAnnotation[];
  draggedCardId: string | null;
}

interface CardBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seedText: string) {
  let seed = hashString(seedText) || 1;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function getRectEdgeIntersection(start: { x: number; y: number }, bounds: CardBounds) {
  const center = {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
  const dx = center.x - start.x;
  const dy = center.y - start.y;

  if (dx === 0 && dy === 0) {
    return center;
  }

  const halfWidth = bounds.width / 2;
  const halfHeight = bounds.height / 2;
  const scaleX = dx === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(dx);
  const scaleY = dy === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);

  return {
    x: center.x - dx * scale,
    y: center.y - dy * scale,
  };
}

function getCardBounds(cardId: string): CardBounds | null {
  const cardEl = document.querySelector<HTMLElement>(`[data-card-id="${cardId}"]`);
  if (!cardEl || !cardEl.offsetParent) {
    return null;
  }

  return {
    x: cardEl.offsetLeft,
    y: cardEl.offsetTop,
    width: cardEl.offsetWidth,
    height: cardEl.offsetHeight,
  };
}

function formatPath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function normalizeVector(x: number, y: number) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function buildArrowWing(
  tip: { x: number; y: number },
  tangent: { x: number; y: number },
  direction: 1 | -1,
  length: number,
  width: number
) {
  const normal = { x: -tangent.y, y: tangent.x };
  const samples = 1;

  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const s = index / samples;
    const retreat = length  * ( s * s);
    const flare = direction * width * (1.5-s) * s * (0.35 + 1.5 * s);

    return {
      x: tip.x - tangent.x * retreat + normal.x * flare,
      y: tip.y - tangent.y * retreat + normal.y * flare,
    };
  });

  return formatPath(points);
}

function buildArrow(annotation: ArrowAnnotation, bounds: CardBounds) {
  const start = annotation.coordinate;
  const edgePoint = getRectEdgeIntersection(start, bounds);
  const seed = `${annotation.cardId}:${annotation.text}:${start.x}:${start.y}`;
  const random = createSeededRandom(seed);
  const edgeDx = edgePoint.x - start.x;
  const edgeDy = edgePoint.y - start.y;
  const edgeDistance = Math.max(Math.hypot(edgeDx, edgeDy), 1);
  const unitX = edgeDx / edgeDistance;
  const unitY = edgeDy / edgeDistance;
  const tipInset = 28 + random() * 14;
  const end = {
    x: edgePoint.x - unitX * tipInset,
    y: edgePoint.y - unitY * tipInset,
  };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.max(Math.hypot(dx, dy), 1);
  const perpX = -unitY;
  const perpY = unitX;
  const bendAmplitude = Math.min(18 + random() * 20, distance * 0.12);
  const bendDirection = random() > 0.5 ? 1 : -1;
  const loopAmplitude = Math.min(26 + random() * 10, distance * 0.1);
  const loopDirection = random() > 0.5 ? 1 : -1;
  const loopCenter = 0.3 + random() * 0.1;
  const loopWidth = 0.15 + random() * 0.045;
  const loopPhase = random() * Math.PI * 2;
  const loopFrequency = 2 + Math.floor(random() * 3);
  const wobble = 1.4 + random() * 1.4;
  const color = annotation.color ?? DEFAULT_ARROW_COLOR;
  const sampleCount = 42;
  const points = Array.from({ length: sampleCount + 1 }, (_, index) => {
    const t = index / sampleCount;
    const baseX = start.x + dx * t;
    const baseY = start.y + dy * t;
    const bendOffset = bendDirection * bendAmplitude * Math.sin(Math.PI * t);
    const loopEnvelope = Math.exp(-Math.pow((t - loopCenter) / loopWidth, 2));
    const loopWave = loopDirection * loopAmplitude * loopEnvelope * Math.sin(loopFrequency * Math.PI * t + loopPhase);
    const offset = bendOffset + loopWave;

    return {
      x: baseX + perpX * offset,
      y: baseY + perpY * offset,
    };
  });
  points[0] = start;
  points[points.length - 1] = end;

  const path = formatPath(points);

  const tipTangent = normalizeVector(
    points[points.length - 1].x - points[points.length - 2].x,
    points[points.length - 1].y - points[points.length - 2].y
  );
  const arrowLength = 22 + random() * 8;
  const arrowSpread = 7 + random() * 3;
  const leftHeadPath = buildArrowWing(end, tipTangent, 1, arrowLength, arrowSpread);
  const rightHeadPath = buildArrowWing(end, tipTangent, -1, arrowLength, arrowSpread);
  const textOffset = 10 + random() * 10;
  const text = {
    x: start.x - unitX * textOffset + perpX * 0,
    y: start.y - unitY * textOffset + perpY * 0,
  };

  return {
    path,
    color,
    leftHeadPath,
    rightHeadPath,
    text,
  };
}

export function ArrowOverlay({ annotations, draggedCardId }: ArrowOverlayProps) {
  const [cardBounds, setCardBounds] = useState<Record<string, CardBounds>>({});

  useEffect(() => {
    let frameId = 0;

    const updateBounds = () => {
      const nextBounds: Record<string, CardBounds> = {};
      for (const annotation of annotations) {
        const bounds = getCardBounds(annotation.cardId);
        if (bounds) {
          nextBounds[annotation.cardId] = bounds;
        }
      }
      setCardBounds(nextBounds);
    };

    const tick = () => {
      updateBounds();
      if (draggedCardId) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    updateBounds();

    if (draggedCardId) {
      frameId = window.requestAnimationFrame(tick);
    }

    window.addEventListener('resize', updateBounds);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateBounds);
    };
  }, [annotations, draggedCardId]);

  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: OVERLAY_BOUNDS.minX,
        top: OVERLAY_BOUNDS.minY,
        width: OVERLAY_BOUNDS.width,
        height: OVERLAY_BOUNDS.height,
      }}
      viewBox={`${OVERLAY_BOUNDS.minX} ${OVERLAY_BOUNDS.minY} ${OVERLAY_BOUNDS.width} ${OVERLAY_BOUNDS.height}`}
      aria-hidden="true"
    >
      {annotations.map((annotation, index) => {
        const bounds = cardBounds[annotation.cardId];
        if (!bounds) {
          return null;
        }

        const arrow = buildArrow(annotation, bounds);

        return (
          <g key={`${annotation.cardId}-${annotation.text}-${index}`}>
            <path
              d={arrow.path}
              fill="none"
              stroke={arrow.color}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.96"
            />
            <path
              d={arrow.leftHeadPath}
              fill="none"
              stroke={arrow.color}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.96"
            />
            <path
              d={arrow.rightHeadPath}
              fill="none"
              stroke={arrow.color}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.96"
            />
            <text
              x={arrow.text.x}
              y={arrow.text.y}
              fill={arrow.color}
              fontWeight="700"
              opacity="0.96"
            >
              {annotation.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

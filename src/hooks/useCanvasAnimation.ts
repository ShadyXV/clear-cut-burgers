import { useEffect, useRef, useState } from 'react';
import { SPECIES } from '../data/animalDeaths';

const VIS = [
  {
    r: 148,
    g: 18,
    b: 18,
    initialLw: 1.0,
    thickenPerSec: 0.55,
    maxThickness: 26,
    growPxPerSec: 64,
    spawnPerSec: 6.0,
    maxLines: 180,
  },
  {
    r: 112,
    g: 9,
    b: 22,
    initialLw: 0.9,
    thickenPerSec: 0.22,
    maxThickness: 18,
    growPxPerSec: 48,
    spawnPerSec: 5.2,
    maxLines: 160,
  },
  {
    r: 176,
    g: 24,
    b: 38,
    initialLw: 1.1,
    thickenPerSec: 0.18,
    maxThickness: 18,
    growPxPerSec: 44,
    spawnPerSec: 4.8,
    maxLines: 150,
  },
  {
    r: 219,
    g: 46,
    b: 46,
    initialLw: 1.4,
    thickenPerSec: 0.08,
    maxThickness: 16,
    growPxPerSec: 38,
    spawnPerSec: 4.2,
    maxLines: 130,
  },
];

interface GrowingLine {
  x: number;
  baseX: number;
  growthPx: number;
  maxGrowthPx: number;
  growPxPerMs: number;
  thickness: number;
  thickenPerMs: number;
  maxThickness: number;
  alpha: number;
  r: number;
  g: number;
  b: number;
  born: number;
  fadeStart: number | null;
  fadeMs: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export function useCanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const anim = useRef({
    lines: SPECIES.map((): GrowingLine[] => []),
    spawnAccum: SPECIES.map(() => Math.random()),
    lastNow: 0,
    canvasW: 0,
    canvasH: 0,
    baselineY: 0,
  });

  const [mountTime] = useState(() => Date.now());
  const [, setTick] = useState(0);

  // Keep text counters live without forcing canvas-adjacent UI to re-render constantly.
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;
    const s = anim.current;

    const resize = () => {
      canvas.width = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      s.canvasW = canvas.width;
      s.canvasH = canvas.height;
      s.baselineY = -Math.max(28, Math.round(canvas.height * 0.045));
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnLine = (colIdx: number, now: number, initialProgress = 0) => {
      const v = VIS[colIdx];
      const colW = s.canvasW / SPECIES.length;
      const pad = 4;
      const baseX = colIdx * colW + pad + Math.random() * (colW - pad * 2);
      const maxGrowthPx = s.canvasH - s.baselineY + 90 + Math.random() * 60;
      const progress = Math.max(0, Math.min(1, initialProgress));
      const thicknessTarget = v.initialLw * (0.8 + Math.random() * 0.4);
      s.lines[colIdx].push({
        x: baseX,
        baseX,
        growthPx: maxGrowthPx * progress,
        maxGrowthPx,
        growPxPerMs: (v.growPxPerSec * (0.7 + Math.random() * 0.6)) / 1000,
        thickness: thicknessTarget,
        thickenPerMs: (v.thickenPerSec * (0.7 + Math.random() * 0.6)) / 1000,
        maxThickness: v.maxThickness,
        alpha: progress > 0 ? 1 : 0,
        r: Math.max(
          0,
          Math.min(255, v.r + Math.floor((Math.random() - 0.5) * 22)),
        ),
        g: Math.max(
          0,
          Math.min(255, v.g + Math.floor((Math.random() - 0.5) * 14)),
        ),
        b: Math.max(
          0,
          Math.min(255, v.b + Math.floor((Math.random() - 0.5) * 22)),
        ),
        born: now,
        fadeStart: null,
        fadeMs: 3600 + Math.random() * 2200,
      });
    };

    const retireCoveredLine = (colIdx: number, now: number) => {
      const lines = s.lines[colIdx];
      const oldestComplete = lines.find(
        (line) => line.fadeStart === null && line.growthPx >= line.maxGrowthPx,
      );
      if (oldestComplete) oldestComplete.fadeStart = now;
    };

    // Seed with staggered, already-grown strips so the screen never starts black.
    const seedNow = performance.now();
    SPECIES.forEach((_, colIdx) => {
      const n = Math.round(VIS[colIdx].maxLines * 0.45);
      for (let i = 0; i < n; i++) {
        spawnLine(colIdx, seedNow - i * 120, Math.random());
      }
    });

    const animate = (now: number) => {
      if (document.hidden) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      if (now - s.lastNow < 33) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const dt = Math.min(now - s.lastNow, 80);
      s.lastNow = now;

      const W = s.canvasW,
        H = s.canvasH,
        BY = s.baselineY;
      const elapsed = (Date.now() - mountTime) / 1000;
      const phaseLocal =
        elapsed < 10 ? 1 : elapsed < 22 ? 2 : elapsed < 40 ? 3 : 4;
      const kp = Math.max(0, Math.min(1, (elapsed - 40) / 25));

      // Background tint darkens toward deep red over time.
      const bgT = Math.min(1, elapsed / 45);
      ctx.fillStyle = `rgb(${Math.round(lerp(9, 12, bgT))},${Math.round(lerp(9, 6, bgT))},${Math.round(lerp(11, 6, bgT))})`;
      ctx.fillRect(0, 0, W, H);

      // Column tints (phases 1-3)
      if (phaseLocal < 4 || kp < 0.7) {
        const tintAlpha = 0.025 * (1 - kp);
        const colW = W / SPECIES.length;
        SPECIES.forEach((_, i) => {
          const v = VIS[i];
          ctx.fillStyle = `rgba(${v.r},${v.g},${v.b},${tintAlpha})`;
          ctx.fillRect(i * colW, 0, colW, H);
        });
      }

      // Column dividers (fade out in phase 4)
      if (kp < 1) {
        ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - kp)})`;
        ctx.lineWidth = 1;
        for (let i = 1; i < SPECIES.length; i++) {
          const x = (W / SPECIES.length) * i;
          ctx.beginPath();
          ctx.moveTo(x, BY);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
      }

      // Spawn new lines
      SPECIES.forEach((_, colIdx) => {
        const v = VIS[colIdx];
        s.spawnAccum[colIdx] += (v.spawnPerSec * dt) / 1000;
        while (s.spawnAccum[colIdx] >= 1) {
          s.spawnAccum[colIdx] -= 1;
          if (s.lines[colIdx].length >= v.maxLines) {
            retireCoveredLine(colIdx, now);
          }
          if (s.lines[colIdx].length < v.maxLines + 24) {
            spawnLine(colIdx, now);
          }
        }
      });

      // Draw drip lines
      SPECIES.forEach((_, colIdx) => {
        s.lines[colIdx].forEach((line) => {
          if (line.alpha < 1) line.alpha = Math.min(1, line.alpha + dt / 400);
          if (line.growthPx < line.maxGrowthPx)
            line.growthPx = Math.min(
              line.maxGrowthPx,
              line.growthPx + line.growPxPerMs * dt,
            );
          if (line.thickness < line.maxThickness)
            line.thickness = Math.min(
              line.maxThickness,
              line.thickness + line.thickenPerMs * dt,
            );

          line.x = line.baseX;

          const fadeT =
            line.fadeStart === null
              ? 0
              : Math.max(0, Math.min(1, (now - line.fadeStart) / line.fadeMs));
          const renderAlpha = line.alpha * (1 - fadeT);
          if (renderAlpha <= 0.01) return;

          const endY = BY + line.growthPx;
          const visibleTopY = Math.max(-40, BY);
          const grad = ctx.createLinearGradient(
            line.x,
            visibleTopY,
            line.x,
            endY,
          );
          grad.addColorStop(
            0,
            `rgba(${line.r},${line.g},${line.b},${renderAlpha * 0.18})`,
          );
          grad.addColorStop(
            0.35,
            `rgba(${line.r},${line.g},${line.b},${renderAlpha * 0.8})`,
          );
          grad.addColorStop(
            0.72,
            `rgba(${Math.max(50, line.r - 38)},${Math.max(0, line.g - 20)},${Math.max(0, line.b - 20)},${renderAlpha * 0.88})`,
          );
          grad.addColorStop(
            1,
            `rgba(${Math.max(60, line.r - 16)},${Math.max(0, line.g - 18)},${Math.max(0, line.b - 18)},${renderAlpha * 0.96})`,
          );

          ctx.beginPath();
          ctx.moveTo(line.x, BY);
          ctx.lineTo(line.x, endY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = line.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
        s.lines[colIdx] = s.lines[colIdx].filter(
          (line) =>
            line.fadeStart === null || now - line.fadeStart < line.fadeMs,
        );
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    s.lastNow = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [mountTime]);

  const elapsedSec = (Date.now() - mountTime) / 1000;

  return { canvasRef, wrapRef, elapsedSec };
}

export { VIS };

import { useEffect, useRef, useState } from 'react';
import { SPECIES } from '../data/animalDeaths';

const VIS = [
  {
    r: 146,
    g: 64,
    b: 14,
    initialLw: 1.0,
    thickenPerSec: 0.55,
    maxThickness: 26,
    growPxPerSec: 32,
    spawnPerSec: 4.5,
    maxLines: 55,
    glow: false,
  },
  {
    r: 110,
    g: 35,
    b: 65,
    initialLw: 0.9,
    thickenPerSec: 0.22,
    maxThickness: 18,
    growPxPerSec: 17,
    spawnPerSec: 2.5,
    maxLines: 45,
    glow: false,
  },
  {
    r: 185,
    g: 70,
    b: 105,
    initialLw: 1.1,
    thickenPerSec: 0.18,
    maxThickness: 18,
    growPxPerSec: 14,
    spawnPerSec: 2.0,
    maxLines: 42,
    glow: false,
  },
  {
    r: 220,
    g: 38,
    b: 38,
    initialLw: 1.4,
    thickenPerSec: 0.08,
    maxThickness: 16,
    growPxPerSec: 9,
    spawnPerSec: 1.2,
    maxLines: 35,
    glow: true,
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
  glow: boolean;
  colIdx: number;
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
    knifeDripGrowth: 0,
  });

  const [mountTime] = useState(() => Date.now());
  const [, setTick] = useState(0);

  // Force re-render every 200ms so elapsed-time-derived UI values stay live
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 200);
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
      s.baselineY = Math.round(canvas.height * 0.12);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnLine = (colIdx: number, now: number) => {
      const v = VIS[colIdx];
      const colW = s.canvasW / SPECIES.length;
      const pad = 4;
      const baseX = colIdx * colW + pad + Math.random() * (colW - pad * 2);
      s.lines[colIdx].push({
        x: baseX,
        baseX,
        growthPx: 0,
        maxGrowthPx: s.canvasH - s.baselineY + 60,
        growPxPerMs: (v.growPxPerSec * (0.7 + Math.random() * 0.6)) / 1000,
        thickness: v.initialLw * (0.8 + Math.random() * 0.4),
        thickenPerMs: (v.thickenPerSec * (0.7 + Math.random() * 0.6)) / 1000,
        maxThickness: v.maxThickness,
        alpha: 0,
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
        glow: v.glow,
        colIdx,
      });
    };

    // Seed initial lines so screen isn't empty at t=0
    const seedNow = performance.now();
    SPECIES.forEach((_, colIdx) => {
      const n = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) spawnLine(colIdx, seedNow - i * 200);
    });

    const animate = (now: number) => {
      const dt = Math.min(now - s.lastNow, 48);
      s.lastNow = now;

      const W = s.canvasW,
        H = s.canvasH,
        BY = s.baselineY;
      const elapsed = (Date.now() - mountTime) / 1000;
      const phaseLocal =
        elapsed < 10 ? 1 : elapsed < 22 ? 2 : elapsed < 40 ? 3 : 4;
      const kp = Math.max(0, Math.min(1, (elapsed - 40) / 25));

      // Background tint — darkens toward deep red over time
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

      // Baseline rule
      ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - kp * 0.5)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, BY);
      ctx.lineTo(W, BY);
      ctx.stroke();

      // Spawn new lines
      SPECIES.forEach((_, colIdx) => {
        const v = VIS[colIdx];
        s.spawnAccum[colIdx] += (v.spawnPerSec * dt) / 1000;
        while (s.spawnAccum[colIdx] >= 1) {
          s.spawnAccum[colIdx] -= 1;
          if (s.lines[colIdx].length < v.maxLines) spawnLine(colIdx, now);
        }
      });

      // Draw drip lines
      const cx = W / 2;
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

          // Phase 4: converge toward canvas centre
          line.x = lerp(line.baseX, cx + (line.baseX - cx) * 0.3, kp);

          const endY = BY + line.growthPx;
          const grad = ctx.createLinearGradient(line.x, BY, line.x, endY);
          grad.addColorStop(
            0,
            `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.45})`,
          );
          grad.addColorStop(
            0.6,
            `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.8})`,
          );
          grad.addColorStop(
            1,
            `rgba(${Math.min(255, line.r + 25)},${line.g},${line.b},${line.alpha * 0.92})`,
          );

          if (line.glow) {
            ctx.shadowColor = `rgba(${line.r},${line.g},${line.b},0.6)`;
            ctx.shadowBlur = 6;
          } else ctx.shadowBlur = 0;

          ctx.beginPath();
          ctx.moveTo(line.x, BY);
          ctx.lineTo(line.x, endY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = line.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
      });
      ctx.shadowBlur = 0;

      // Phase 4 central drip from knife tip (starts at t=50s)
      if (elapsed >= 50) {
        const dripStartT = elapsed - 50;
        s.knifeDripGrowth = Math.min(H * 0.55, dripStartT * 6);
        const dripTopY = BY + 14;
        const dripBottomY = dripTopY + s.knifeDripGrowth;
        const dripWidth = lerp(8, 14, Math.min(1, dripStartT / 20));

        const dripGrad = ctx.createLinearGradient(
          cx,
          dripTopY,
          cx,
          dripBottomY,
        );
        dripGrad.addColorStop(0, 'rgba(220, 38, 38, 0.6)');
        dripGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.95)');
        dripGrad.addColorStop(1, 'rgba(140, 12, 12, 1)');

        ctx.beginPath();
        ctx.moveTo(cx, dripTopY);
        ctx.lineTo(cx, dripBottomY);
        ctx.strokeStyle = dripGrad;
        ctx.lineWidth = dripWidth;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(220, 38, 38, 0.8)';
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, dripBottomY, dripWidth * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 22, 22, 0.95)';
        ctx.fill();
      }

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
  const knifeProgress = Math.max(0, Math.min(1, (elapsedSec - 40) / 25));
  const showPlantCTA = elapsedSec >= 50;

  return { canvasRef, wrapRef, elapsedSec, knifeProgress, showPlantCTA };
}

export { VIS };

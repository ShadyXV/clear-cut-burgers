import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { SPECIES } from '../data/animalDeaths';

// Visual properties per species
const VIS = [
  { r: 120, g: 20,  b: 20,  lw: 1.3, growPxPerSec: 32, spawnPerSec: 4.5, maxLines: 70 }, // chicken — dense dark red
  { r: 100, g: 15,  b: 15,  lw: 1.1, growPxPerSec: 17, spawnPerSec: 2.5, maxLines: 60 }, // ducks — darker
  { r: 180, g: 22,  b: 75,  lw: 1.4, growPxPerSec: 14, spawnPerSec: 2.0, maxLines: 55 }, // pigs — pinkish blood
  { r: 220, g: 35,  b: 35,  lw: 2.8, growPxPerSec: 9,  spawnPerSec: 1.2, maxLines: 45 }, // cattle — bright crimson, thick
];

interface GrowingLine {
  x: number;
  growthPx: number;    // how many px it has grown below baseline (increases each frame)
  maxGrowthPx: number; // settles once it hits canvas bottom
  growPxPerMs: number;
  alpha: number;       // 0 → 1 fade-in, stays at 1 forever
  r: number; g: number; b: number;
  lw: number;
  born: number;        // performance.now() timestamp
}

interface Arc {
  sx: number; sy: number; // start (top of canvas)
  ex: number;            // end x at baseline
  t: number;             // 0→1 progress
  speed: number;         // 1/duration in per-ms
  alpha: number;
}

interface AnimalDeathsScreenProps {
  burgerState: Record<string, string | null>;
  onBack: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export const AnimalDeathsScreen = ({ burgerState, onBack }: AnimalDeathsScreenProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);

  // All mutable animation state lives here — never triggers re-renders
  const anim = useRef({
    lines:       SPECIES.map((): GrowingLine[] => []),
    arcs:        [] as Arc[],
    spawnAccum:  SPECIES.map(() => Math.random()),  // stagger initial spawns
    arcAccum:    SPECIES.map(() => 0),
    lastNow:     0,
    baselineY:   0,
    canvasH:     0,
    canvasW:     0,
  });

  // Live counter
  const [mountTime] = useState(() => Date.now());
  const [, tick]    = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 120);
    return () => clearInterval(id);
  }, []);

  // Burger context
  const elapsed      = (Date.now() - mountTime) / 1000;
  const activeIngs   = new Set(Object.values(burgerState).filter(Boolean) as string[]);
  const highlighted  = new Set(
    SPECIES.flatMap((sp, i) => sp.ingredientIds.some(id => activeIngs.has(id)) ? [i] : [])
  );

  const proteinId = burgerState.protein1;
  let contextNote = 'Animals are killed for food at a scale most people never see. These lines keep growing — 24 hours a day, 365 days a year.';
  if (proteinId === 'beefPatty')
    contextNote = 'Your burger uses beef. ~9 cattle are slaughtered globally every single second. Watch the red column grow.';
  else if (proteinId === 'grilledChicken' || proteinId === 'crispyChicken')
    contextNote = 'Your burger uses chicken. Nearly 2,000 chickens die every second worldwide — 61 billion per year.';

  // Canvas setup + animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx  = canvas.getContext('2d')!;
    const s    = anim.current;

    const resize = () => {
      canvas.width  = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      s.canvasW    = canvas.width;
      s.canvasH    = canvas.height;
      s.baselineY  = Math.round(canvas.height * 0.14);
    };
    resize();
    window.addEventListener('resize', resize);

    // Helper: spawn one growing line for a species column
    const spawnLine = (colIdx: number, now: number) => {
      const v    = VIS[colIdx];
      const colW = s.canvasW / SPECIES.length;
      const pad  = 4;
      const x    = colIdx * colW + pad + Math.random() * (colW - pad * 2);
      const variance = 0.65 + Math.random() * 0.7;
      s.lines[colIdx].push({
        x,
        growthPx:    0,
        maxGrowthPx: s.canvasH - s.baselineY + 60,
        growPxPerMs: (v.growPxPerSec * variance) / 1000,
        alpha:       0,
        r: Math.max(0, Math.min(255, v.r + Math.floor((Math.random() - 0.5) * 28))),
        g: Math.max(0, Math.min(255, v.g + Math.floor((Math.random() - 0.5) * 12))),
        b: Math.max(0, Math.min(255, v.b + Math.floor((Math.random() - 0.5) * 28))),
        lw:    v.lw * (0.75 + Math.random() * 0.55),
        born:  now,
      });
    };

    // Helper: spawn an arc that sweeps down to the baseline
    const spawnArc = (colIdx: number) => {
      const colW = s.canvasW / SPECIES.length;
      s.arcs.push({
        sx:    colIdx * colW + colW / 2 + (Math.random() - 0.5) * colW * 0.7,
        sy:    0,
        ex:    colIdx * colW + 4 + Math.random() * (colW - 8),
        t:     0,
        speed: 1 / (350 + Math.random() * 350),
        alpha: 0.05 + Math.random() * 0.06,
      });
    };

    // Seed initial lines so the visualization isn't empty at start
    const seedNow = performance.now();
    SPECIES.forEach((_, colIdx) => {
      for (let i = 0; i < 10; i++) spawnLine(colIdx, seedNow - i * 300);
    });

    const animate = (now: number) => {
      const dt = Math.min(now - s.lastNow, 48);
      s.lastNow = now;
      const W = s.canvasW, H = s.canvasH, BY = s.baselineY;
      const maxGrowth = H - BY + 60;

      // Clear with near-black (not pure black so lines have a tiny glow contrast)
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);

      // ── Spawn new lines ─────────────────────────────────────
      SPECIES.forEach((_, colIdx) => {
        const v = VIS[colIdx];
        s.spawnAccum[colIdx] += (v.spawnPerSec * dt) / 1000;
        while (s.spawnAccum[colIdx] >= 1) {
          s.spawnAccum[colIdx] -= 1;
          if (s.lines[colIdx].length < v.maxLines) spawnLine(colIdx, now);
        }

        s.arcAccum[colIdx] += (v.spawnPerSec * 0.6 * dt) / 1000;
        while (s.arcAccum[colIdx] >= 1) {
          s.arcAccum[colIdx] -= 1;
          if (s.arcs.length < 40) spawnArc(colIdx);
        }
      });

      // ── Draw arcs above baseline ─────────────────────────────
      s.arcs = s.arcs.filter(arc => {
        arc.t += arc.speed * dt;
        if (arc.t >= 1) return false;

        // Bezier point at t
        const cp  = { x: (arc.sx + arc.ex) / 2, y: BY * 0.35 };
        const bx  = (1 - arc.t) * (1 - arc.t) * arc.sx + 2 * (1 - arc.t) * arc.t * cp.x + arc.t * arc.t * arc.ex;
        const by  = (1 - arc.t) * (1 - arc.t) * arc.sy + 2 * (1 - arc.t) * arc.t * cp.y + arc.t * arc.t * BY;
        const fadeAlpha = arc.alpha * (1 - arc.t * arc.t);

        ctx.beginPath();
        ctx.moveTo(arc.sx, 0);
        ctx.quadraticCurveTo(cp.x, cp.y, bx, by);
        ctx.strokeStyle = `rgba(255,180,180,${fadeAlpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        return true;
      });

      // ── Draw baseline ────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, BY);
      ctx.lineTo(W, BY);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Draw growing lines ───────────────────────────────────
      SPECIES.forEach((_, colIdx) => {
        s.lines[colIdx].forEach(line => {
          // Fade in over 400ms
          if (line.alpha < 1) {
            line.alpha = Math.min(1, line.alpha + dt / 400);
          }

          // Grow — lines NEVER shrink or disappear
          if (line.growthPx < maxGrowth) {
            line.growthPx = Math.min(maxGrowth, line.growthPx + line.growPxPerMs * dt);
          }

          const endY = BY + line.growthPx;

          // Subtle blood gradient: slightly brighter at the drip tip
          const grad = ctx.createLinearGradient(line.x, BY, line.x, endY);
          grad.addColorStop(0,   `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.5})`);
          grad.addColorStop(0.6, `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.85})`);
          grad.addColorStop(1,   `rgba(${Math.min(255, line.r + 30)},${line.g},${line.b},${line.alpha * 0.95})`);

          ctx.beginPath();
          ctx.moveTo(line.x, BY);
          ctx.lineTo(line.x, endY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = line.lw;
          ctx.stroke();
        });
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    s.lastNow = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">

      {/* Header */}
      <div className="shrink-0 px-6 pt-5 pb-4 border-b border-zinc-900">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors mb-3"
        >
          <ArrowLeft size={10} />
          Back
        </button>
        <h2 className="text-2xl font-black italic text-zinc-100 leading-tight tracking-tight">
          OUT OF SIGHT,<br />OUT OF MIND.
        </h2>
        <p className="text-[11px] text-zinc-500 mt-1.5 uppercase tracking-widest">
          Animals killed for food while you use this app
        </p>
      </div>

      {/* Live counter grid */}
      <div className="shrink-0 grid grid-cols-4 border-b border-zinc-900">
        {SPECIES.map((sp, idx) => {
          const count = sp.perSec * elapsed;
          const isHL  = highlighted.has(idx);
          const v     = VIS[idx];
          const hexColor = `rgb(${v.r},${v.g},${v.b})`;
          return (
            <div
              key={sp.id}
              className={`px-3 py-3 border-r border-zinc-900 last:border-r-0 flex flex-col gap-0.5 ${isHL ? 'bg-red-950/20' : ''}`}
            >
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: isHL ? '#f87171' : '#52525b' }}
              >
                {sp.label}
              </span>
              <span
                className="text-xl font-black tabular-nums leading-tight"
                style={{ color: isHL ? '#fca5a5' : hexColor }}
              >
                {formatCount(count)}
              </span>
              <span className="text-[8px] font-mono text-zinc-700">
                {sp.perSec < 10 ? `${sp.perSec.toFixed(1)}/s` : `${Math.round(sp.perSec).toLocaleString()}/s`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Canvas — the visualization */}
      <div ref={wrapRef} className="flex-1 min-h-0 relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Column labels pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex pointer-events-none">
          {SPECIES.map((sp, idx) => {
            const isHL = highlighted.has(idx);
            const v    = VIS[idx];
            return (
              <div key={sp.id} className="flex-1 flex flex-col items-center pb-3 gap-0.5">
                <span
                  className="text-[10px] font-black uppercase tracking-wider"
                  style={{ color: isHL ? `rgb(${v.r + 60},${v.g + 20},${v.b + 20})` : `rgb(${v.r},${v.g},${v.b})` }}
                >
                  {sp.label}
                </span>
                <span className="text-[8px] font-mono text-zinc-700">
                  {(sp.perYear / 1_000_000_000).toFixed(1)}B/yr
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual note */}
      <div className="shrink-0 border-t border-zinc-900 px-6 py-4">
        <p className="text-xs text-zinc-400 leading-relaxed">{contextNote}</p>
        <p className="text-[9px] text-zinc-700 mt-2 uppercase tracking-wider">
          Source: FAO global livestock slaughter statistics
        </p>
      </div>
    </div>
  );
};

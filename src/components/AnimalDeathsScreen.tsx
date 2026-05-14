import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { SPECIES } from '../data/animalDeaths';
import { ICONS_BY_SPECIES_ID } from './AnimalIcons';
import { SourcesTooltip } from './SourcesTooltip';
import { RotatingFact } from './RotatingFact';

// Visual properties per species. Indexed by SPECIES order:
// [chicken, ducks, pigs, cattle]
const VIS = [
  { // chicken — fastest, dense, dark red-orange
    r: 146, g: 64,  b: 14,
    initialLw: 1.0, thickenPerSec: 0.55, maxThickness: 26,
    growPxPerSec: 32, spawnPerSec: 4.5, maxLines: 55, glow: false,
  },
  { // ducks — medium, dark wine
    r: 110, g: 35,  b: 65,
    initialLw: 0.9, thickenPerSec: 0.22, maxThickness: 18,
    growPxPerSec: 17, spawnPerSec: 2.5, maxLines: 45, glow: false,
  },
  { // pigs — pinkish rose
    r: 185, g: 70,  b: 105,
    initialLw: 1.1, thickenPerSec: 0.18, maxThickness: 18,
    growPxPerSec: 14, spawnPerSec: 2.0, maxLines: 42, glow: false,
  },
  { // cattle — bright crimson, glow
    r: 220, g: 38,  b: 38,
    initialLw: 1.4, thickenPerSec: 0.08, maxThickness: 16,
    growPxPerSec: 9,  spawnPerSec: 1.2, maxLines: 35, glow: true,
  },
];

interface GrowingLine {
  x: number;
  baseX: number;          // original x before phase-4 drift (so we can re-derive)
  growthPx: number;       // distance grown below baseline
  maxGrowthPx: number;
  growPxPerMs: number;
  thickness: number;      // grows over lifetime
  thickenPerMs: number;
  maxThickness: number;
  alpha: number;          // 0 → 1 fade-in
  r: number; g: number; b: number;
  born: number;
  glow: boolean;
  colIdx: number;
}

interface AnimalDeathsScreenProps {
  burgerState: Record<string, string | null>;
  onBack: () => void;
  onSwitchToPlant: () => void;
}

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

export const AnimalDeathsScreen = ({ burgerState, onBack, onSwitchToPlant }: AnimalDeathsScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const mountStartRef = useRef<number>(performance.now());

  const anim = useRef({
    lines:      SPECIES.map((): GrowingLine[] => []),
    spawnAccum: SPECIES.map(() => Math.random()),
    lastNow:    0,
    canvasW:    0,
    canvasH:    0,
    baselineY:  0,
    // Big knife-tip drip (created at t≈50s)
    knifeDripGrowth: 0,
  });

  // Live counter + phase tick
  const [mountTime] = useState(() => Date.now());
  const [, tick]    = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 200);
    return () => clearInterval(id);
  }, []);

  const elapsedSec = (Date.now() - mountTime) / 1000;
  const phase =
    elapsedSec < 10 ? 1 :
    elapsedSec < 22 ? 2 :
    elapsedSec < 40 ? 3 : 4;
  const knifeProgress = Math.max(0, Math.min(1, (elapsedSec - 40) / 25)); // 0→1 over phase 4

  // Burger context
  const activeIngs = new Set(Object.values(burgerState).filter(Boolean) as string[]);
  const highlighted = new Set(
    SPECIES.flatMap((sp, i) => sp.ingredientIds.some(id => activeIngs.has(id)) ? [i] : [])
  );

  const proteinId = burgerState.protein1;
  const showPlantCTA = elapsedSec >= 50 && proteinId !== 'blackBeanPatty';
  const isPlantBurger = proteinId === 'blackBeanPatty';

  let contextNote: string;
  if (isPlantBurger) {
    contextNote = "Your burger uses plant protein — no animals died for it. The blood you see represents the global toll of meat. Your choice is the small ripple that opposes it.";
  } else if (proteinId === 'beefPatty') {
    contextNote = "Your burger uses beef. ~9 cattle are slaughtered globally every single second. Each line in the cattle column is one death that happened while you watched.";
  } else if (proteinId === 'grilledChicken' || proteinId === 'crispyChicken') {
    contextNote = "Your burger uses chicken. Nearly 2,000 chickens die every second worldwide — 61 billion per year. Their column fills first because their lives are shortest.";
  } else {
    contextNote = "The killing never stops. 24 hours a day, 365 days a year, somewhere on the planet, a knife is doing this work — for someone's plate.";
  }

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d')!;
    const s = anim.current;

    const resize = () => {
      canvas.width  = wrap.clientWidth;
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
        r: Math.max(0, Math.min(255, v.r + Math.floor((Math.random() - 0.5) * 22))),
        g: Math.max(0, Math.min(255, v.g + Math.floor((Math.random() - 0.5) * 14))),
        b: Math.max(0, Math.min(255, v.b + Math.floor((Math.random() - 0.5) * 22))),
        born: now,
        glow: v.glow,
        colIdx,
      });
    };

    // Seed a few initial lines per column so the screen isn't empty at t=0
    const seedNow = performance.now();
    SPECIES.forEach((_, colIdx) => {
      const n = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) spawnLine(colIdx, seedNow - i * 200);
    });

    const animate = (now: number) => {
      const dt = Math.min(now - s.lastNow, 48);
      s.lastNow = now;

      const W = s.canvasW, H = s.canvasH, BY = s.baselineY;
      const elapsed = (Date.now() - mountTime) / 1000;
      const phaseLocal =
        elapsed < 10 ? 1 :
        elapsed < 22 ? 2 :
        elapsed < 40 ? 3 : 4;
      const kp = Math.max(0, Math.min(1, (elapsed - 40) / 25));

      // Background — interpolated tint
      const bgT = Math.min(1, elapsed / 45);
      const bgR = Math.round(lerp(9, 12, bgT));
      const bgG = Math.round(lerp(9,  6, bgT));
      const bgB = Math.round(lerp(11, 6, bgT));
      ctx.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
      ctx.fillRect(0, 0, W, H);

      // Subtle column background tints (phases 1-3)
      if (phaseLocal < 4 || kp < 0.7) {
        const tintAlpha = 0.025 * (1 - kp);
        const colW = W / SPECIES.length;
        SPECIES.forEach((_, i) => {
          const v = VIS[i];
          ctx.fillStyle = `rgba(${v.r},${v.g},${v.b},${tintAlpha})`;
          ctx.fillRect(i * colW, 0, colW, H);
        });
      }

      // Vertical column dividers (phases 1-3, fade out in 4)
      if (kp < 1) {
        const dividerAlpha = 0.04 * (1 - kp);
        ctx.strokeStyle = `rgba(255,255,255,${dividerAlpha})`;
        ctx.lineWidth = 1;
        for (let i = 1; i < SPECIES.length; i++) {
          const x = (W / SPECIES.length) * i;
          ctx.beginPath();
          ctx.moveTo(x, BY);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
      }

      // Baseline
      ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - kp * 0.5)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, BY);
      ctx.lineTo(W, BY);
      ctx.stroke();

      // Spawn new lines (skip plant-burger? — keep spawning, it's the global toll, not the user's burger alone)
      SPECIES.forEach((_, colIdx) => {
        const v = VIS[colIdx];
        s.spawnAccum[colIdx] += (v.spawnPerSec * dt) / 1000;
        while (s.spawnAccum[colIdx] >= 1) {
          s.spawnAccum[colIdx] -= 1;
          if (s.lines[colIdx].length < v.maxLines) spawnLine(colIdx, now);
        }
      });

      // Draw lines with thickness + length growth
      // In phase 4, horizontal positions interpolate toward canvas centre
      const cx = W / 2;
      SPECIES.forEach((_, colIdx) => {
        s.lines[colIdx].forEach(line => {
          // Fade in
          if (line.alpha < 1) line.alpha = Math.min(1, line.alpha + dt / 400);

          // Grow length
          if (line.growthPx < line.maxGrowthPx) {
            line.growthPx = Math.min(line.maxGrowthPx, line.growthPx + line.growPxPerMs * dt);
          }
          // Grow thickness
          if (line.thickness < line.maxThickness) {
            line.thickness = Math.min(line.maxThickness, line.thickness + line.thickenPerMs * dt);
          }

          // Phase 4: drift toward centre
          line.x = lerp(line.baseX, cx + (line.baseX - cx) * 0.15, kp);

          const endY = BY + line.growthPx;

          // Gradient: lighter at the top (drip head), brighter at the tip
          const grad = ctx.createLinearGradient(line.x, BY, line.x, endY);
          grad.addColorStop(0,   `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.45})`);
          grad.addColorStop(0.6, `rgba(${line.r},${line.g},${line.b},${line.alpha * 0.8})`);
          grad.addColorStop(1,   `rgba(${Math.min(255, line.r + 25)},${line.g},${line.b},${line.alpha * 0.92})`);

          if (line.glow) {
            ctx.shadowColor = `rgba(${line.r},${line.g},${line.b},0.6)`;
            ctx.shadowBlur = 6;
          } else {
            ctx.shadowBlur = 0;
          }

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

      // Phase-4 large central blood drip from knife tip
      if (elapsed >= 50) {
        const dripStartT = elapsed - 50;
        s.knifeDripGrowth = Math.min(H * 0.55, dripStartT * 6);
        const dripTopY = BY + 14;
        const dripBottomY = dripTopY + s.knifeDripGrowth;
        const dripWidth = lerp(8, 14, Math.min(1, dripStartT / 20));

        const dripGrad = ctx.createLinearGradient(cx, dripTopY, cx, dripBottomY);
        dripGrad.addColorStop(0,   'rgba(220, 38, 38, 0.6)');
        dripGrad.addColorStop(0.5, 'rgba(220, 38, 38, 0.95)');
        dripGrad.addColorStop(1,   'rgba(140, 12, 12, 1)');

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

        // Drop bulge at the tip
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

  // Column header positions for the icon overlay
  const iconOpacity = phase < 4 ? 1 : Math.max(0.15, 1 - knifeProgress * 1.1);

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden relative">

      {/* Header */}
      <div className="shrink-0 px-6 pt-5 pb-3 border-b border-zinc-900">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors mb-2"
        >
          <ArrowLeft size={10} />
          Back
        </button>
        <h2 className="text-2xl font-black italic text-zinc-100 leading-tight tracking-tight">
          OUT OF SIGHT,<br />OUT OF MIND.
        </h2>
        <p className="text-[11px] text-zinc-500 mt-1.5 uppercase tracking-widest">
          Animals killed for food since you opened this app
        </p>
      </div>

      {/* Live counter grid */}
      <div className="shrink-0 grid grid-cols-4 border-b border-zinc-900">
        {SPECIES.map((sp, idx) => {
          const count = sp.perSec * elapsedSec;
          const isHL = highlighted.has(idx);
          const v = VIS[idx];
          const deathsPerDrop = Math.round(sp.perSec / v.spawnPerSec);
          const Icon = ICONS_BY_SPECIES_ID[sp.id];
          return (
            <div
              key={sp.id}
              className={`px-3 py-3 border-r border-zinc-900 last:border-r-0 flex flex-col gap-1 ${isHL ? 'bg-red-950/25' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                {Icon && <Icon size={12} color={isHL ? '#fca5a5' : `rgb(${v.r},${v.g},${v.b})`} />}
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: isHL ? '#fca5a5' : '#52525b' }}
                >
                  {sp.label}
                </span>
              </div>
              <span
                className="text-lg font-black tabular-nums leading-tight"
                style={{ color: isHL ? '#fca5a5' : `rgb(${v.r + 30},${v.g + 20},${v.b + 20})` }}
              >
                {formatCount(count)}
              </span>
              <span className="text-[8px] font-mono text-zinc-700 leading-none">
                ~{deathsPerDrop}/drop · {sp.perSec < 10 ? sp.perSec.toFixed(1) : Math.round(sp.perSec).toLocaleString()}/s
              </span>
            </div>
          );
        })}
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="flex-1 min-h-0 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Animal icon row at top of canvas — fades during phase 4 */}
        <div
          className="absolute top-2 left-0 right-0 grid grid-cols-4 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: iconOpacity }}
        >
          {SPECIES.map((sp, idx) => {
            const v = VIS[idx];
            const isHL = highlighted.has(idx);
            const color = isHL ? '#f87171' : `rgb(${Math.min(255, v.r + 40)},${Math.min(255, v.g + 20)},${Math.min(255, v.b + 20)})`;
            const Icon = ICONS_BY_SPECIES_ID[sp.id];
            return (
              <div key={sp.id} className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  {Icon && <Icon size={18} color={color} />}
                  <div className="w-6 h-[2px]" style={{ background: color, opacity: 0.7 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Knife blade SVG overlay — fades in during phase 4 */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.svg
              key="knife"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.min(1, knifeProgress * 1.3) }}
              transition={{ duration: 0.6 }}
              viewBox="0 0 200 400"
              preserveAspectRatio="xMidYMid meet"
              className="absolute top-[10%] left-1/2 -translate-x-1/2 h-[55%] pointer-events-none"
              style={{ filter: 'drop-shadow(0 0 18px rgba(220, 38, 38, 0.35))' }}
            >
              <defs>
                <linearGradient id="bladeFace" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="rgba(40, 40, 50, 0.85)" />
                  <stop offset="35%"  stopColor="rgba(140, 145, 160, 0.75)" />
                  <stop offset="55%"  stopColor="rgba(210, 215, 230, 0.92)" />
                  <stop offset="80%"  stopColor="rgba(120, 125, 140, 0.78)" />
                  <stop offset="100%" stopColor="rgba(40, 40, 50, 0.85)" />
                </linearGradient>
                <linearGradient id="bladeEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(190, 195, 210, 0.0)" />
                  <stop offset="40%"  stopColor="rgba(230, 235, 250, 0.4)" />
                  <stop offset="100%" stopColor="rgba(240, 245, 255, 0.85)" />
                </linearGradient>
                <linearGradient id="bloodSmear" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(120, 18, 18, 0.0)" />
                  <stop offset="40%"  stopColor="rgba(170, 25, 25, 0.45)" />
                  <stop offset="80%"  stopColor="rgba(220, 38, 38, 0.7)" />
                  <stop offset="100%" stopColor="rgba(220, 38, 38, 0.85)" />
                </linearGradient>
              </defs>
              {/* Blade shape: rectangular tapering to a pointed tip */}
              <path d="M 60 0 L 140 0 L 140 320 L 100 380 L 60 320 Z" fill="url(#bladeFace)" />
              {/* Sharp edge highlight */}
              <path d="M 65 4 L 135 4 L 135 318 L 100 374 L 65 318 Z" fill="none" stroke="url(#bladeEdge)" strokeWidth="0.8" />
              {/* Reflection slash near upper third */}
              <path d="M 70 80 L 88 100 L 86 130 L 68 110 Z" fill="rgba(255,255,255,0.1)" />
              {/* Blood smear over the blade */}
              <path d="M 60 0 L 140 0 L 140 320 L 100 380 L 60 320 Z" fill="url(#bloodSmear)" opacity={Math.min(1, knifeProgress * 1.4)} />
              {/* Drips clinging to the blade at various heights */}
              <g fill="rgba(180, 22, 22, 0.85)" opacity={Math.min(1, knifeProgress * 1.2)}>
                <ellipse cx="78" cy="240" rx="2.5" ry="6" />
                <ellipse cx="122" cy="280" rx="3" ry="8" />
                <ellipse cx="100" cy="320" rx="2.5" ry="7" />
                <ellipse cx="90" cy="200" rx="2" ry="5" />
              </g>
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Plant CTA — appears at t≥50s */}
        <AnimatePresence>
          {showPlantCTA && (
            <motion.button
              key="plant-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              onClick={onSwitchToPlant}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold rounded-full hover:bg-emerald-900/80 hover:border-emerald-500 transition-colors shadow-xl backdrop-blur-sm"
            >
              <Sprout size={13} />
              Try a plant-based burger
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Contextual note + rotating fact + sources */}
      <div className="shrink-0 border-t border-zinc-900 px-6 py-3 bg-zinc-950/70 space-y-2">
        <p className="text-xs text-zinc-400 leading-relaxed">{contextNote}</p>
        <RotatingFact />
        <div className="flex items-center justify-between pt-1">
          <SourcesTooltip />
          <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono">
            {phase < 4 ? `Phase ${phase}/4` : 'The knife\'s edge'}
          </span>
        </div>
      </div>
    </div>
  );
};

import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SPECIES } from '../data/animalDeaths';
import { ICONS_BY_SPECIES_ID } from './AnimalIcons';
import { SourcesTooltip } from './SourcesTooltip';
import { RotatingFact } from './RotatingFact';
import { useCanvasAnimation, VIS } from '../hooks/useCanvasAnimation';
import { useBurgerStore } from '../store/useBurgerStore';

function formatCount(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

export const AnimalDeathsScreen = () => {
  const navigate = useNavigate();
  const { burgerState, setSlot, resetForBuilder } = useBurgerStore();

  const onBack = () => navigate('/impact');
  const onSwitchToPlant = () => {
    setSlot('protein1', 'blackBeanPatty', 1);
    resetForBuilder();
    navigate('/build');
  };

  const { canvasRef, wrapRef, elapsedSec, knifeProgress } =
    useCanvasAnimation();

  const activeIngs = new Set(
    Object.values(burgerState).filter(Boolean) as string[],
  );
  const highlighted = new Set(
    SPECIES.flatMap((sp, i) =>
      sp.ingredientIds.some((id) => activeIngs.has(id)) ? [i] : [],
    ),
  );

  const proteinId = burgerState.protein1;
  const isPlantBurger =
    proteinId === 'blackBeanPatty' ||
    proteinId === 'chickpeaPatty' ||
    proteinId === 'mushroomPatty';
  const phase =
    elapsedSec < 10 ? 1 : elapsedSec < 22 ? 2 : elapsedSec < 40 ? 3 : 4;
  const iconOpacity = phase < 4 ? 1 : Math.max(0.15, 1 - knifeProgress * 1.1);

  let contextNote: string;
  if (isPlantBurger) {
    contextNote =
      'Your burger uses plant protein — no animals died for it. The blood you see represents the global toll of meat. Your choice is the small ripple that opposes it.';
  } else if (proteinId === 'beefPatty') {
    contextNote =
      'Your burger uses beef. ~9 cattle are slaughtered globally every single second. Each line in the cattle column is one death that happened while you watched.';
  } else if (proteinId === 'grilledChicken' || proteinId === 'crispyChicken') {
    contextNote =
      'Your burger uses chicken. Nearly 2,000 chickens die every second worldwide — 61 billion per year. Their column fills first because their lives are shortest.';
  } else {
    contextNote =
      "The killing never stops. 24 hours a day, 365 days a year, somewhere on the planet, a knife is doing this work — for someone's plate.";
  }

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
          OUT OF SIGHT,
          <br />
          OUT OF MIND.
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
                {Icon && (
                  <Icon
                    size={12}
                    color={isHL ? '#fca5a5' : `rgb(${v.r},${v.g},${v.b})`}
                  />
                )}
                <span
                  className="text-[9px] font-black uppercase tracking-widest"
                  style={{ color: isHL ? '#fca5a5' : '#52525b' }}
                >
                  {sp.label}
                </span>
              </div>
              <span
                className="text-lg font-black tabular-nums leading-tight"
                style={{
                  color: isHL
                    ? '#fca5a5'
                    : `rgb(${v.r + 30},${v.g + 20},${v.b + 20})`,
                }}
              >
                {formatCount(count)}
              </span>
              <span className="text-[8px] font-mono text-zinc-700 leading-none">
                ~{deathsPerDrop}/drop ·{' '}
                {sp.perSec < 10
                  ? sp.perSec.toFixed(1)
                  : Math.round(sp.perSec).toLocaleString()}
                /s
              </span>
            </div>
          );
        })}
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="flex-1 min-h-0 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Animal icon row — fades during phase 4 */}
        <div
          className="absolute top-2 left-0 right-0 grid grid-cols-4 pointer-events-none transition-opacity duration-1000"
          style={{ opacity: iconOpacity }}
        >
          {SPECIES.map((sp, idx) => {
            const v = VIS[idx];
            const isHL = highlighted.has(idx);
            const color = isHL
              ? '#f87171'
              : `rgb(${Math.min(255, v.r + 40)},${Math.min(255, v.g + 20)},${Math.min(255, v.b + 20)})`;
            const Icon = ICONS_BY_SPECIES_ID[sp.id];
            return (
              <div key={sp.id} className="flex justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  {Icon && <Icon size={18} color={color} />}
                  <div
                    className="w-6 h-[2px]"
                    style={{ background: color, opacity: 0.7 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal butcher's cleaver */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.svg
              key="knife"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.min(1, knifeProgress * 1.3) }}
              transition={{ duration: 0.6 }}
              viewBox="0 0 1600 400"
              preserveAspectRatio="xMidYMid meet"
              className="absolute w-3/4 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: '88%',
                filter:
                  'drop-shadow(0 8px 32px rgba(0,0,0,0.98)) drop-shadow(0 2px 6px rgba(0,0,0,0.85))',
              }}
            >
              <defs>
                <linearGradient
                  id="kBladeFace"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1e2028" />
                  <stop offset="14%" stopColor="#4e5468" />
                  <stop offset="36%" stopColor="#aab2c4" />
                  <stop offset="54%" stopColor="#d0d7e4" />
                  <stop offset="76%" stopColor="#72798a" />
                  <stop offset="100%" stopColor="#383c4a" />
                </linearGradient>
                <linearGradient
                  id="kEdgeGlint"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(190,210,255,0.0)" />
                  <stop offset="3%" stopColor="rgba(228,240,255,0.88)" />
                  <stop offset="50%" stopColor="rgba(248,254,255,1.0)" />
                  <stop offset="97%" stopColor="rgba(228,240,255,0.82)" />
                  <stop offset="100%" stopColor="rgba(190,210,255,0.0)" />
                </linearGradient>
                <linearGradient
                  id="kBloodSmear"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="rgba(130,12,12,0.0)" />
                  <stop offset="20%" stopColor="rgba(155,18,18,0.18)" />
                  <stop offset="62%" stopColor="rgba(198,30,30,0.52)" />
                  <stop offset="100%" stopColor="rgba(218,36,36,0.82)" />
                </linearGradient>
                <linearGradient id="kHandle" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#160b05" />
                  <stop offset="28%" stopColor="#38190a" />
                  <stop offset="58%" stopColor="#422012" />
                  <stop offset="100%" stopColor="#160b05" />
                </linearGradient>
                <linearGradient id="kBolster" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2e313b" />
                  <stop offset="38%" stopColor="#82899a" />
                  <stop offset="54%" stopColor="#a4acbc" />
                  <stop offset="100%" stopColor="#2e313b" />
                </linearGradient>
              </defs>

              <rect
                x="58"
                y="18"
                width="1150"
                height="366"
                fill="url(#kBladeFace)"
              />
              <rect
                x="58"
                y="18"
                width="1150"
                height="8"
                fill="rgba(12,14,20,0.9)"
              />
              <path
                d="M 155,48 L 435,48 L 412,225 L 132,225 Z"
                fill="rgba(255,255,255,0.068)"
              />
              <path
                d="M 525,36 L 720,36 L 704,194 L 509,194 Z"
                fill="rgba(255,255,255,0.044)"
              />
              <path
                d="M 790,52 L 920,52 L 908,182 L 778,182 Z"
                fill="rgba(255,255,255,0.030)"
              />
              <rect
                x="58"
                y="18"
                width="1150"
                height="366"
                fill="url(#kBloodSmear)"
                opacity={Math.min(1, knifeProgress * 1.4)}
              />
              <line
                x1="58"
                y1="384"
                x2="1208"
                y2="384"
                stroke="url(#kEdgeGlint)"
                strokeWidth="4"
              />
              <rect
                x="1208"
                y="18"
                width="48"
                height="366"
                fill="url(#kBolster)"
              />
              <line
                x1="1232"
                y1="18"
                x2="1232"
                y2="384"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
              />
              <path
                d="M 1256,40 L 1580,58 Q 1600,100, 1600,201 Q 1600,302, 1580,344 L 1256,362 Z"
                fill="url(#kHandle)"
              />
              <g stroke="rgba(255,210,160,0.055)" strokeWidth="1.3" fill="none">
                <line x1="1260" y1="88" x2="1588" y2="104" />
                <line x1="1260" y1="128" x2="1594" y2="141" />
                <line x1="1260" y1="168" x2="1598" y2="178" />
                <line x1="1260" y1="201" x2="1600" y2="201" />
                <line x1="1260" y1="234" x2="1598" y2="224" />
                <line x1="1260" y1="274" x2="1594" y2="261" />
                <line x1="1260" y1="314" x2="1588" y2="298" />
              </g>
              {([1326, 1432, 1538] as const).map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy={201} r={18} fill="rgba(70,60,46,0.94)" />
                  <circle
                    cx={cx}
                    cy={201}
                    r={18}
                    fill="none"
                    stroke="rgba(106,93,72,0.68)"
                    strokeWidth="2.2"
                  />
                  <circle
                    cx={cx - 4}
                    cy={196}
                    r={7}
                    fill="rgba(138,122,96,0.30)"
                  />
                </g>
              ))}
              <rect
                x="1256"
                y="40"
                width="6"
                height="322"
                fill="rgba(0,0,0,0.52)"
              />
            </motion.svg>
          )}
        </AnimatePresence>

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-zinc-900 px-6 py-3 bg-zinc-950/70 space-y-2">
        <p className="text-xs text-zinc-400 leading-relaxed">{contextNote}</p>
        <RotatingFact />
        <div className="flex items-center justify-between pt-1">
          <SourcesTooltip />
          <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono">
            {phase < 4 ? `Phase ${phase}/4` : "The knife's edge"}
          </span>
        </div>
      </div>
    </div>
  );
};

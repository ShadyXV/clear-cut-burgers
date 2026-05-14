import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Skull } from 'lucide-react';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import { IMPACT_DATA, STAT_META, COMPARISON, StatKey } from '../data/impact';
import { SvgMap } from './ingredients/IngredientLibrary';
import { RotatingFact } from './RotatingFact';
import { SourcesTooltip } from './SourcesTooltip';

const STAT_KEYS: StatKey[] = ['co2', 'water', 'land', 'methane', 'trees', 'feed'];

// Cubic ease-out tween hook
function useCountUp(target: number, durationMs: number, start: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) {
      setValue(target); // when not staged, just show real value
      return;
    }
    setValue(0);
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      setValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, durationMs]);
  return value;
}

interface ImpactScreenProps {
  burgerState: Record<string, string | null>;
  onBack: () => void;
  onViewDeaths: () => void;
  /** When true, plays the cinematic arrival sequence (rows fly in, drum-roll, bars fill, footer reveal). */
  stagedEntry?: boolean;
}

const IngredientThumbnail = ({ ingredientId, isTopBun, isBottomBun }: { ingredientId: string; isTopBun?: boolean; isBottomBun?: boolean }) => {
  const isBun = INGREDIENTS[ingredientId]?.category === 'bun';
  const svgKey = isBun
    ? `${ingredientId}_${isTopBun ? 'top' : 'bottom'}`
    : ingredientId;
  const SvgComp = SvgMap[svgKey];
  if (!SvgComp) return <div className="w-[72px] h-9" />;
  return (
    <svg viewBox="0 0 320 160" width="72" height="36" style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.4))' }}>
      <SvgComp />
    </svg>
  );
};

const formatValue = (val: number): string => {
  if (val === 0) return '0';
  if (val < 0.01) return val.toFixed(3);
  if (val < 0.1) return val.toFixed(2);
  if (val < 10) return val.toFixed(1);
  return val.toFixed(0);
};

interface IngredientRowProps {
  slotId: string;
  slotLabel: string;
  isTopBun?: boolean;
  isBottomBun?: boolean;
  ingredientId: string;
  ingredientName?: string;
  value: number;
  pct: number;
  meta: typeof STAT_META[StatKey];
  index: number;
  barsReady: boolean;
  stagedEntry: boolean;
  initialDelaySec: number;
}

const IngredientRow = ({
  slotId, slotLabel, isTopBun, isBottomBun, ingredientId, ingredientName,
  value, pct, meta, index, barsReady, stagedEntry, initialDelaySec,
}: IngredientRowProps) => {
  const displayValue = useCountUp(value, 700, stagedEntry && barsReady);
  const rowDelay = stagedEntry ? initialDelaySec + index * 0.06 : index * 0.05;

  return (
    <motion.div
      key={slotId}
      initial={{ opacity: 0, x: stagedEntry ? 0 : 20, scale: stagedEntry ? 0.92 : 1 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: rowDelay, type: 'spring', stiffness: 200, damping: 25 }}
      className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 last:border-b-0"
    >
      {/* Left: label + bar */}
      <div className="flex-1 flex flex-col gap-1.5 justify-center pr-2 min-w-0">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none truncate">
          {slotLabel}
        </span>
        <span className="text-[11px] text-zinc-400 font-semibold leading-none truncate">
          {ingredientName}
        </span>
        <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-0.5">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${meta.barBg}`}
            initial={{ width: 0 }}
            animate={{ width: stagedEntry && !barsReady ? 0 : `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, delay: stagedEntry ? index * 0.04 : index * 0.025 }}
          />
        </div>
      </div>

      {/* Center: SVG thumbnail */}
      <div className="shrink-0 flex items-center justify-center">
        <IngredientThumbnail
          ingredientId={ingredientId}
          isTopBun={isTopBun}
          isBottomBun={isBottomBun}
        />
      </div>

      {/* Right: value */}
      <div className="w-16 flex flex-col items-end justify-center shrink-0 pl-1">
        <span className={`text-sm font-black tabular-nums ${meta.color}`}>
          {stagedEntry && !barsReady ? '—' : formatValue(displayValue)}
        </span>
        <span className="text-[9px] text-zinc-600 font-mono mt-0.5 leading-none">
          {meta.unit}
        </span>
      </div>
    </motion.div>
  );
};

export const ImpactScreen = ({ burgerState, onBack, onViewDeaths, stagedEntry = false }: ImpactScreenProps) => {
  const [activeStat, setActiveStat] = useState<StatKey>('co2');

  // Staged entry choreography
  const [barsReady, setBarsReady] = useState(!stagedEntry);
  const [chromeReady, setChromeReady] = useState(!stagedEntry);

  useEffect(() => {
    if (!stagedEntry) return;
    // Phase G + drum-roll: rows fly in over ~0.8s, then 300ms pause, then bars fill
    const barsTimer = setTimeout(() => setBarsReady(true), 1100);
    // Footer chrome reveals after bars start filling
    const chromeTimer = setTimeout(() => setChromeReady(true), 1900);
    return () => {
      clearTimeout(barsTimer);
      clearTimeout(chromeTimer);
    };
  }, [stagedEntry]);

  const activeRows = BURGER_SLOTS.filter(s => burgerState[s.id] !== null);

  const getVal = (slotId: string): number => {
    const ingredientId = burgerState[slotId];
    if (!ingredientId) return 0;
    return IMPACT_DATA[ingredientId]?.[activeStat] ?? 0;
  };

  const maxVal = Math.max(...activeRows.map(s => getVal(s.id)), 0.001);
  const total = activeRows.reduce((sum, s) => sum + getVal(s.id), 0);

  const meta = STAT_META[activeStat];
  const ctx = COMPARISON[activeStat];

  // Animated total for staged entry; static otherwise
  const displayTotal = useCountUp(total, 900, stagedEntry && barsReady);
  const comparisonText = ctx.template.replace('{v}', ctx.convert(stagedEntry && !barsReady ? 0 : displayTotal));

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">

      {/* Stat pill selector */}
      <motion.div
        initial={stagedEntry ? { opacity: 0, y: -8 } : false}
        animate={stagedEntry ? { opacity: chromeReady ? 1 : 0, y: chromeReady ? 0 : -8 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-3 border-b border-zinc-800 shrink-0"
      >
        {STAT_KEYS.map((key) => {
          const m = STAT_META[key];
          return (
            <button
              key={key}
              onClick={() => setActiveStat(key)}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider cursor-pointer select-none shrink-0 transition-colors"
            >
              {activeStat === key && (
                <motion.div
                  layoutId="pill"
                  className="absolute inset-0 rounded-full bg-zinc-800 border border-zinc-700"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${activeStat === key ? m.color : 'text-zinc-500'}`}>
                {m.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Ingredient rows */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={activeStat} className="py-1">
            {activeRows.map((slot, index) => {
              const ingredientId = burgerState[slot.id]!;
              const val = getVal(slot.id);
              const pct = Math.round((val / maxVal) * 100);
              const ingredient = INGREDIENTS[ingredientId];

              return (
                <IngredientRow
                  key={slot.id}
                  slotId={slot.id}
                  slotLabel={slot.label}
                  isTopBun={slot.isTopBun}
                  isBottomBun={slot.isBottomBun}
                  ingredientId={ingredientId}
                  ingredientName={ingredient?.name}
                  value={val}
                  pct={pct}
                  meta={meta}
                  index={index}
                  barsReady={barsReady}
                  stagedEntry={stagedEntry}
                  initialDelaySec={0.1}
                />
              );
            })}

            {/* Rotating fact bar inside the scrolling area, before the footer */}
            <motion.div
              initial={stagedEntry ? { opacity: 0 } : false}
              animate={{ opacity: stagedEntry ? (chromeReady ? 1 : 0) : 1 }}
              transition={{ duration: 0.4, delay: stagedEntry ? 0.1 : 0 }}
              className="px-4 py-3 border-t border-zinc-800/50"
            >
              <RotatingFact />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.div
        initial={stagedEntry ? { y: 30, opacity: 0 } : false}
        animate={stagedEntry ? { y: chromeReady ? 0 : 30, opacity: chromeReady ? 1 : 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.45, type: 'spring', stiffness: 240, damping: 28 }}
        className="shrink-0 border-t border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm"
      >
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Total Impact</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black tabular-nums ${meta.color}`}>{formatValue(displayTotal)}</span>
          <span className="text-sm text-zinc-400 font-normal">{meta.unit}</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1 leading-snug">{comparisonText}</p>
        <button
          onClick={onViewDeaths}
          className="mt-4 w-full py-2.5 bg-red-950/30 border border-red-900/50 text-red-400 text-xs font-bold rounded-xl hover:bg-red-950/50 transition-colors flex items-center justify-center gap-1.5"
        >
          <Skull size={11} />
          SEE THE ANIMAL TOLL →
        </button>
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-5 py-2 border border-zinc-700 text-zinc-500 text-xs font-bold rounded-full hover:border-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Edit Burger
          </button>
          <SourcesTooltip />
        </div>
      </motion.div>
    </div>
  );
};

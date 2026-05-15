import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Skull } from 'lucide-react';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import { IMPACT_DATA, STAT_META, COMPARISON, StatKey } from '../data/impact';
import { RotatingFact } from './RotatingFact';
import { SourcesTooltip } from './SourcesTooltip';
import { IngredientRow } from './IngredientRow';
import { useCountUp, formatValue } from '../utils/impact';
import { SPRING, DUR } from '../constants/animations';

const STAT_KEYS: StatKey[] = [
  'co2',
  'water',
  'land',
  'methane',
  'trees',
  'feed',
];

interface ImpactScreenProps {
  burgerState: Record<string, string | null>;
  onBack: () => void;
  onViewDeaths: () => void;
  stagedEntry?: boolean;
}

export const ImpactScreen = ({
  burgerState,
  onBack,
  onViewDeaths,
  stagedEntry = false,
}: ImpactScreenProps) => {
  const [activeStat, setActiveStat] = useState<StatKey>('co2');
  const [barsReady, setBarsReady] = useState(!stagedEntry);
  const [chromeReady, setChromeReady] = useState(!stagedEntry);

  useEffect(() => {
    if (!stagedEntry) return;
    const barsTimer = setTimeout(() => setBarsReady(true), 1100);
    const chromeTimer = setTimeout(() => setChromeReady(true), 1900);
    return () => {
      clearTimeout(barsTimer);
      clearTimeout(chromeTimer);
    };
  }, [stagedEntry]);

  const activeRows = BURGER_SLOTS.filter((s) => burgerState[s.id] !== null);

  const getVal = (slotId: string): number => {
    const ingredientId = burgerState[slotId];
    if (!ingredientId) return 0;
    return IMPACT_DATA[ingredientId]?.[activeStat] ?? 0;
  };

  const maxVal = Math.max(...activeRows.map((s) => getVal(s.id)), 0.001);
  const total = activeRows.reduce((sum, s) => sum + getVal(s.id), 0);
  const meta = STAT_META[activeStat];
  const ctx = COMPARISON[activeStat];

  const displayTotal = useCountUp(total, 900, stagedEntry && barsReady);
  const comparisonText = ctx.template.replace(
    '{v}',
    ctx.convert(stagedEntry && !barsReady ? 0 : displayTotal),
  );

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">
      {/* Stat pill selector */}
      <motion.div
        initial={stagedEntry ? { opacity: 0, y: -8 } : false}
        animate={
          stagedEntry
            ? { opacity: chromeReady ? 1 : 0, y: chromeReady ? 0 : -8 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: DUR.NAV }}
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
                  transition={SPRING.SNAPPY}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${activeStat === key ? m.color : 'text-zinc-500'}`}
              >
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
        animate={
          stagedEntry
            ? { y: chromeReady ? 0 : 30, opacity: chromeReady ? 1 : 0 }
            : { y: 0, opacity: 1 }
        }
        transition={SPRING.FOOTER}
        className="shrink-0 border-t border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm"
      >
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
            Total Impact
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black tabular-nums ${meta.color}`}>
            {formatValue(displayTotal)}
          </span>
          <span className="text-sm text-zinc-400 font-normal">{meta.unit}</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1 leading-snug">
          {comparisonText}
        </p>
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

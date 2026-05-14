import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import { IMPACT_DATA, STAT_META, COMPARISON, StatKey } from '../data/impact';
import { SvgMap } from './ingredients/IngredientLibrary';

const STAT_KEYS: StatKey[] = ['co2', 'water', 'land', 'methane'];

interface ImpactScreenProps {
  burgerState: Record<string, string | null>;
  onBack: () => void;
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

export const ImpactScreen = ({ burgerState, onBack }: ImpactScreenProps) => {
  const [activeStat, setActiveStat] = useState<StatKey>('co2');

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
  const comparisonText = ctx.template.replace('{v}', ctx.convert(total));

  const formatValue = (val: number): string => {
    if (val === 0) return '0';
    if (val < 0.1) return val.toFixed(2);
    if (val < 10) return val.toFixed(1);
    return val.toFixed(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">

      {/* Stat pill selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-6 py-3 border-b border-zinc-800 shrink-0">
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
      </div>

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
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
                  className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 last:border-b-0"
                >
                  {/* Left: label + bar */}
                  <div className="flex-1 flex flex-col gap-1.5 justify-center pr-2 min-w-0">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-none truncate">
                      {slot.label}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-semibold leading-none truncate">
                      {ingredient?.name}
                    </span>
                    <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mt-0.5">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full ${meta.barBg}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: index * 0.025 }}
                      />
                    </div>
                  </div>

                  {/* Center: SVG thumbnail */}
                  <div className="shrink-0 flex items-center justify-center">
                    <IngredientThumbnail
                      ingredientId={ingredientId}
                      isTopBun={slot.isTopBun}
                      isBottomBun={slot.isBottomBun}
                    />
                  </div>

                  {/* Right: value */}
                  <div className="w-16 flex flex-col items-end justify-center shrink-0 pl-1">
                    <span className={`text-sm font-black tabular-nums ${meta.color}`}>
                      {formatValue(val)}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono mt-0.5 leading-none">
                      {meta.unit}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Total Impact</span>
          <span className={`text-[9px] font-bold uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black tabular-nums ${meta.color}`}>{formatValue(total)}</span>
          <span className="text-sm text-zinc-400 font-normal">{meta.unit}</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1 leading-snug">{comparisonText}</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-full hover:border-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft size={12} />
          Edit Burger
        </button>
      </div>
    </div>
  );
};

import { motion } from 'motion/react';
import { SPRING } from '../constants/animations';
import { INGREDIENTS } from '../data/ingredients';
import { StatKey, STAT_META } from '../data/impact';
import { SvgMap } from './ingredients/IngredientLibrary';
import { useCountUp, formatValue } from '../utils/impact';

const IngredientThumbnail = ({
  ingredientId,
  isTopBun,
}: {
  ingredientId: string;
  isTopBun?: boolean;
}) => {
  const isBun = INGREDIENTS[ingredientId]?.category === 'bun';
  const svgKey = isBun
    ? `${ingredientId}_${isTopBun ? 'top' : 'bottom'}`
    : ingredientId;
  const SvgComp = SvgMap[svgKey];
  if (!SvgComp) return <div className="w-[72px] h-9" />;
  return (
    <svg
      viewBox="0 0 320 160"
      width="72"
      height="36"
      style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.4))' }}
    >
      <SvgComp />
    </svg>
  );
};

export interface IngredientRowProps {
  slotId: string;
  slotLabel: string;
  isTopBun?: boolean;
  isBottomBun?: boolean;
  ingredientId: string;
  ingredientName?: string;
  value: number;
  pct: number;
  meta: (typeof STAT_META)[StatKey];
  index: number;
  barsReady: boolean;
  stagedEntry: boolean;
  initialDelaySec: number;
}

export const IngredientRow = ({
  slotId,
  slotLabel,
  isTopBun,
  ingredientId,
  ingredientName,
  value,
  pct,
  meta,
  index,
  barsReady,
  stagedEntry,
  initialDelaySec,
}: IngredientRowProps) => {
  const displayValue = useCountUp(value, 700, stagedEntry && barsReady);
  const rowDelay = stagedEntry ? initialDelaySec + index * 0.06 : index * 0.05;

  return (
    <motion.div
      key={slotId}
      initial={{
        opacity: 0,
        x: stagedEntry ? 0 : 20,
        scale: stagedEntry ? 0.92 : 1,
      }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: rowDelay, ...SPRING.SMOOTH }}
      className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 last:border-b-0"
    >
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
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 20,
              delay: stagedEntry ? index * 0.04 : index * 0.025,
            }}
          />
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center">
        <IngredientThumbnail ingredientId={ingredientId} isTopBun={isTopBun} />
      </div>

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

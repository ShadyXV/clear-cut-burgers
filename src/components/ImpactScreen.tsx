import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import {
  IMPACT_DATA,
  STAT_META,
  COMPARISON,
  STAT_KEYS,
  StatKey,
} from '../data/impact';
import { RotatingFact } from './RotatingFact';
import { SourcesTooltip } from './SourcesTooltip';
import { IngredientRow } from './IngredientRow';
import { useCountUp, formatValue } from '../utils/impact';
import { SPRING, DUR } from '../constants/animations';
import { useBurgerStore } from '../store/useBurgerStore';

type ImpactView = 'bars' | 'plant' | 'hotspots';
type ActiveRow = {
  slot: (typeof BURGER_SLOTS)[number];
  ingredientId: string;
};
type ImpactTotals = Record<StatKey, number>;

const VIEW_OPTIONS: { id: ImpactView; label: string }[] = [
  { id: 'bars', label: 'Ingredient bars' },
  { id: 'plant', label: 'Plant swap' },
  { id: 'hotspots', label: 'Hotspots' },
];

const PLANT_BASED_SWAPS: Record<string, string> = {
  beefPatty: 'blackBeanPatty',
  grilledChicken: 'chickpeaPatty',
  crispyChicken: 'chickpeaPatty',
  cheddar: 'veganSmoked',
  emmental: 'veganSmoked',
  mozzarella: 'cashewCheese',
  pepperCheese: 'veganSmoked',
  bacon: 'guacamole',
  cheeseTopped: 'chiveSesame',
  sauceMayo: 'saucePiri',
};

const getPlantBasedIngredientId = (ingredientId: string) =>
  PLANT_BASED_SWAPS[ingredientId] ?? ingredientId;

const getMetricValue = (ingredientId: string, stat: StatKey) =>
  IMPACT_DATA[ingredientId]?.[stat] ?? 0;

const emptyTotals = (): ImpactTotals => ({
  co2: 0,
  water: 0,
  land: 0,
  methane: 0,
  trees: 0,
  feed: 0,
});

const getTotals = (rows: ActiveRow[]): ImpactTotals =>
  rows.reduce((totals, row) => {
    STAT_KEYS.forEach((key) => {
      totals[key] += getMetricValue(row.ingredientId, key);
    });
    return totals;
  }, emptyTotals());

const getPct = (value: number, max: number) => {
  if (value <= 0) return 0;
  return Math.max((value / max) * 100, 2);
};

const formatSharePercent = (value: number) => {
  if (value === 0) return '0%';
  if (value < 1) return '<1%';
  if (value > 99 && value < 100) return '>99%';
  return `${Math.round(value)}%`;
};

const formatReductionPercent = (selected: number, comparison: number) => {
  if (selected <= 0) return '0%';
  const reduction = Math.max(selected - comparison, 0);
  const reductionPct = (reduction / selected) * 100;

  return formatSharePercent(reductionPct);
};

export const ImpactScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { burgerState, resetForBuilder } = useBurgerStore();

  const stagedEntry = location.state?.stagedEntry || false;

  const [activeStat, setActiveStat] = useState<StatKey>('co2');
  const [activeView, setActiveView] = useState<ImpactView>('bars');
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

  const onBack = () => {
    resetForBuilder();
    navigate('/build');
  };

  const activeRows = BURGER_SLOTS.flatMap((slot) => {
    const ingredientId = burgerState[slot.id];
    return ingredientId ? [{ slot, ingredientId }] : [];
  });

  const plantRows = activeRows.map((row) => ({
    ...row,
    ingredientId: getPlantBasedIngredientId(row.ingredientId),
    originalIngredientId: row.ingredientId,
  }));

  const selectedTotals = getTotals(activeRows);
  const plantTotals = getTotals(plantRows);
  const swappedCount = plantRows.filter(
    (row) => row.ingredientId !== row.originalIngredientId,
  ).length;

  const maxVal = Math.max(
    ...activeRows.map((row) => getMetricValue(row.ingredientId, activeStat)),
    0.001,
  );
  const total = selectedTotals[activeStat];
  const meta = STAT_META[activeStat];
  const ctx = COMPARISON[activeStat];

  const displayTotal = useCountUp(total, 900, stagedEntry && barsReady);
  const comparisonText = ctx.template.replace(
    '{v}',
    ctx.convert(stagedEntry && !barsReady ? 0 : displayTotal),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#09090b]">
      <motion.div
        initial={stagedEntry ? { opacity: 0, y: -8 } : false}
        animate={
          stagedEntry
            ? { opacity: chromeReady ? 1 : 0, y: chromeReady ? 0 : -8 }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: DUR.NAV }}
        className="shrink-0 border-b border-zinc-800"
      >
        <div className="flex gap-2 overflow-x-auto px-6 py-3 no-scrollbar">
          {STAT_KEYS.map((key) => {
            const m = STAT_META[key];
            return (
              <button
                key={key}
                onClick={() => setActiveStat(key)}
                className="relative flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider transition-colors"
              >
                {activeStat === key && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 rounded-full border border-zinc-700 bg-zinc-800"
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
        </div>

        <div className="flex gap-1 overflow-x-auto px-6 pb-3 no-scrollbar">
          {VIEW_OPTIONS.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                activeView === view.id
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeStat}-${activeView}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === 'bars' && (
              <IngredientBarsView
                activeRows={activeRows}
                activeStat={activeStat}
                maxVal={maxVal}
                barsReady={barsReady}
                stagedEntry={stagedEntry}
              />
            )}

            {activeView === 'plant' && (
              <PlantComparisonView
                activeStat={activeStat}
                selectedTotals={selectedTotals}
                plantTotals={plantTotals}
                swappedCount={swappedCount}
                onStatSelect={setActiveStat}
              />
            )}

            {activeView === 'hotspots' && (
              <HotspotsView
                activeRows={activeRows}
                activeStat={activeStat}
                total={total}
              />
            )}

            <motion.div
              initial={stagedEntry ? { opacity: 0 } : false}
              animate={{ opacity: stagedEntry ? (chromeReady ? 1 : 0) : 1 }}
              transition={{ duration: 0.4, delay: stagedEntry ? 0.1 : 0 }}
              className="border-t border-zinc-800/50 px-4 py-3"
            >
              <RotatingFact />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={stagedEntry ? { y: 30, opacity: 0 } : false}
        animate={
          stagedEntry
            ? { y: chromeReady ? 0 : 30, opacity: chromeReady ? 1 : 0 }
            : { y: 0, opacity: 1 }
        }
        transition={SPRING.FOOTER}
        className="shrink-0 border-t border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-sm"
      >
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
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
          <span className="text-sm font-normal text-zinc-400">{meta.unit}</span>
        </div>
        <p className="mt-1 text-xs leading-snug text-zinc-500">
          {comparisonText}
        </p>
        <p className="mt-2 text-[10px] leading-snug text-zinc-700">
          Global-average serving estimates. CO2e, land, and freshwater use are
          scaled from Poore & Nemecek data via Our World in Data. Forest
          opportunity uses Searchinger et al.; methane and feed are estimates.
        </p>
        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-xs font-bold text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300"
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

const IngredientBarsView = ({
  activeRows,
  activeStat,
  maxVal,
  barsReady,
  stagedEntry,
}: {
  activeRows: ActiveRow[];
  activeStat: StatKey;
  maxVal: number;
  barsReady: boolean;
  stagedEntry: boolean;
}) => {
  const meta = STAT_META[activeStat];

  return (
    <div className="py-1">
      {activeRows.map((row, index) => {
        const val = getMetricValue(row.ingredientId, activeStat);
        const pct = Math.round((val / maxVal) * 100);
        const ingredient = INGREDIENTS[row.ingredientId];

        return (
          <IngredientRow
            key={row.slot.id}
            slotId={row.slot.id}
            slotLabel={row.slot.label}
            isTopBun={row.slot.isTopBun}
            isBottomBun={row.slot.isBottomBun}
            ingredientId={row.ingredientId}
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
    </div>
  );
};

const PlantComparisonView = ({
  activeStat,
  selectedTotals,
  plantTotals,
  swappedCount,
  onStatSelect,
}: {
  activeStat: StatKey;
  selectedTotals: ImpactTotals;
  plantTotals: ImpactTotals;
  swappedCount: number;
  onStatSelect: (stat: StatKey) => void;
}) => {
  const meta = STAT_META[activeStat];
  const selected = selectedTotals[activeStat];
  const plant = plantTotals[activeStat];
  const reductionPct = formatReductionPercent(selected, plant);
  const plantPct = selected > 0 ? (plant / selected) * 100 : 0;

  return (
    <div className="space-y-4 px-5 py-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Plant-based comparison
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-100">
              Same burger shape, animal ingredients swapped.
            </h2>
          </div>
          <div className="rounded-full border border-zinc-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
            {swappedCount} swaps
          </div>
        </div>
        <p className="mt-2 max-w-[66ch] text-xs leading-relaxed text-zinc-500">
          Beef and chicken become plant patties, dairy cheese becomes vegan
          cheese, bacon becomes guacamole, and mayo becomes piri-piri sauce.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_72px_1fr] items-stretch gap-2">
        <ImpactTotalCard
          label="Your burger"
          value={selected}
          unit={meta.unit}
          colorClass={meta.color}
        />
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-2 text-center">
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
            lower
          </div>
          <div className="text-2xl font-black text-amber-400">
            {reductionPct}
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
            plant
          </div>
        </div>
        <ImpactTotalCard
          label="Plant swap"
          value={plant}
          unit={meta.unit}
          colorClass="text-emerald-400"
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Side-by-side breakdown
          </h3>
          <span className="text-[10px] text-zinc-600">
            Plant is {formatSharePercent(plantPct)} of selected
          </span>
        </div>
        <div className="space-y-3">
          {STAT_KEYS.map((key) => {
            const rowMeta = STAT_META[key];
            const selectedValue = selectedTotals[key];
            const plantValue = plantTotals[key];
            const max = Math.max(selectedValue, plantValue, 0.001);
            const rowReduction = formatReductionPercent(
              selectedValue,
              plantValue,
            );

            return (
              <button
                key={key}
                onClick={() => onStatSelect(key)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  activeStat === key
                    ? 'border-zinc-600 bg-zinc-900'
                    : 'border-zinc-900 bg-zinc-950 hover:border-zinc-700'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider ${rowMeta.color}`}
                  >
                    {rowMeta.label}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500">
                    {rowReduction} lower
                  </span>
                </div>
                <div className="grid grid-cols-[72px_1fr_52px] items-center gap-2 text-[10px] text-zinc-500">
                  <span>Your burger</span>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className={`${rowMeta.barBg} h-full rounded-full`}
                      style={{ width: `${getPct(selectedValue, max)}%` }}
                    />
                  </div>
                  <span className="text-right tabular-nums text-zinc-300">
                    {formatValue(selectedValue)}
                  </span>

                  <span>Plant</span>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${getPct(plantValue, max)}%` }}
                    />
                  </div>
                  <span className="text-right tabular-nums text-zinc-300">
                    {formatValue(plantValue)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ImpactTotalCard = ({
  label,
  value,
  unit,
  colorClass,
}: {
  label: string;
  value: number;
  unit: string;
  colorClass: string;
}) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-center">
    <div className="mb-1 text-[9px] font-black uppercase tracking-widest text-zinc-600">
      {label}
    </div>
    <div className={`text-2xl font-black tabular-nums ${colorClass}`}>
      {formatValue(value)}
    </div>
    <div className="mt-0.5 text-[10px] text-zinc-600">{unit}</div>
  </div>
);

const HotspotsView = ({
  activeRows,
  activeStat,
  total,
}: {
  activeRows: ActiveRow[];
  activeStat: StatKey;
  total: number;
}) => {
  const meta = STAT_META[activeStat];
  const rankedRows = [...activeRows]
    .map((row) => ({
      ...row,
      value: getMetricValue(row.ingredientId, activeStat),
    }))
    .sort((a, b) => b.value - a.value);
  const topRow = rankedRows[0];
  const topShare = total > 0 && topRow ? (topRow.value / total) * 100 : 0;

  return (
    <div className="space-y-4 px-5 py-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
          Hotspot view
        </p>
        <h2 className="mt-1 text-xl font-black tracking-tight text-zinc-100">
          One layer often explains almost the whole number.
        </h2>
        {topRow && (
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {INGREDIENTS[topRow.ingredientId]?.name ?? topRow.ingredientId}{' '}
            contributes {formatSharePercent(topShare)} of this burger&apos;s{' '}
            {meta.label.toLowerCase()}.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
            Share of selected metric
          </h3>
          <span className={`text-[10px] font-bold ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        <div className="space-y-3">
          {rankedRows.map((row, index) => {
            const ingredient = INGREDIENTS[row.ingredientId];
            const share = total > 0 ? (row.value / total) * 100 : 0;

            return (
              <div key={row.slot.id}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-zinc-200">
                      {ingredient?.name ?? row.ingredientId}
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      {row.slot.label}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black tabular-nums text-zinc-200">
                      {formatSharePercent(share)}
                    </div>
                    <div className="text-[10px] tabular-nums text-zinc-600">
                      {formatValue(row.value)} {meta.unit}
                    </div>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                  <motion.div
                    className={`${index === 0 ? meta.barBg : 'bg-zinc-700'} h-full rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getPct(row.value, total || 1)}%` }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.03,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

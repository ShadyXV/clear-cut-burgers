import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sprout, Skull } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BURGER_SLOTS } from '../data/ingredients';
import { IMPACT_DATA, STAT_META, COMPARISON, StatKey } from '../data/impact';
import { formatValue } from '../utils/impact';
import { SourcesTooltip } from './SourcesTooltip';
import { SPRING, DUR } from '../constants/animations';
import { useBurgerStore } from '../store/useBurgerStore';

const STAT_KEYS: StatKey[] = ['co2', 'water', 'land', 'methane', 'trees', 'feed'];
const PLANT_PROTEINS = new Set(['blackBeanPatty', 'chickpeaPatty', 'mushroomPatty']);

export const CompareScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { burgerState, resetForBuilder } = useBurgerStore();

  const stagedEntry = location.state?.stagedEntry || false;
  const [activeStat, setActiveStat] = useState<StatKey>('co2');
  const [ready, setReady] = useState(!stagedEntry);

  useEffect(() => {
    if (!stagedEntry) return;
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, [stagedEntry]);

  const activeRows = BURGER_SLOTS.filter((s) => burgerState[s.id] !== null);

  const veganTotal = activeRows.reduce((sum, s) => {
    const id = burgerState[s.id];
    return sum + (id ? (IMPACT_DATA[id]?.[activeStat] ?? 0) : 0);
  }, 0);

  const beefTotal = activeRows.reduce((sum, s) => {
    const id = burgerState[s.id];
    if (!id) return sum;
    const effectiveId = PLANT_PROTEINS.has(id) ? 'beefPatty' : id;
    return sum + (IMPACT_DATA[effectiveId]?.[activeStat] ?? 0);
  }, 0);

  const saved = beefTotal - veganTotal;
  const savingPct = beefTotal > 0 ? Math.round((saved / beefTotal) * 100) : 0;
  const veganFraction = beefTotal > 0 ? veganTotal / beefTotal : 0;

  const meta = STAT_META[activeStat];
  const ctx = COMPARISON[activeStat];

  const plantProteinCount = ['protein1', 'protein2', 'protein3'].filter(
    (s) => burgerState[s] && PLANT_PROTEINS.has(burgerState[s]!),
  ).length;

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={stagedEntry ? { opacity: 0, y: -10 } : false}
        animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : -10 }}
        transition={{ duration: DUR.NAV }}
        className="shrink-0 px-6 pt-5 pb-4 border-b border-zinc-900"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sprout size={12} className="text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
            Plant-Based Choice
          </span>
        </div>
        <h2 className="text-3xl font-black italic text-zinc-100 leading-tight tracking-tight">
          YOU CHOSE
          <br />
          WISELY.
        </h2>
        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
          Here's what your choice spared the planet — versus the beef equivalent.
        </p>
      </motion.div>

      {/* Stat pills */}
      <motion.div
        initial={stagedEntry ? { opacity: 0 } : false}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: DUR.NAV, delay: 0.1 }}
        className="shrink-0 flex gap-2 overflow-x-auto no-scrollbar px-6 py-3 border-b border-zinc-800"
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
                  layoutId="compare-pill"
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

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Side-by-side cards */}
        <motion.div
          initial={stagedEntry ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-[1fr_52px_1fr] gap-2 items-center"
        >
          {/* Vegan card */}
          <div className="bg-emerald-950/25 border border-emerald-900/50 rounded-2xl p-4 text-center">
            <Sprout size={16} className="text-emerald-500 mx-auto mb-2" />
            <div className="text-[9px] text-emerald-700 uppercase tracking-widest font-bold mb-1">
              Your Burger
            </div>
            <div className={`text-2xl font-black tabular-nums ${meta.color}`}>
              {formatValue(veganTotal)}
            </div>
            <div className="text-[10px] text-zinc-600 mt-0.5">{meta.unit}</div>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-[8px] text-zinc-700 uppercase tracking-widest font-bold">
              saved
            </div>
            <div className="text-xl font-black text-amber-400">{savingPct}%</div>
            <div className="text-[8px] text-zinc-700 uppercase tracking-widest font-bold">
              less
            </div>
          </div>

          {/* Beef card */}
          <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-4 text-center opacity-60">
            <Skull size={16} className="text-red-800 mx-auto mb-2" />
            <div className="text-[9px] text-red-900 uppercase tracking-widest font-bold mb-1">
              Beef Version
            </div>
            <div className="text-2xl font-black tabular-nums text-red-700">
              {formatValue(beefTotal)}
            </div>
            <div className="text-[10px] text-zinc-700 mt-0.5">{meta.unit}</div>
          </div>
        </motion.div>

        {/* Proportion bar */}
        <motion.div
          initial={stagedEntry ? { opacity: 0 } : false}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="space-y-1.5"
        >
          <div className="relative h-5 rounded-full bg-zinc-900 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-emerald-600/50 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: ready ? `${Math.max(veganFraction * 100, 1.5)}%` : 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-zinc-700 uppercase tracking-widest">
            <span>Your choice</span>
            <span>Beef version</span>
          </div>
        </motion.div>

        {/* "You spared" callout */}
        <motion.div
          initial={stagedEntry ? { opacity: 0, scale: 0.97 } : false}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.97 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5"
        >
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">
            You spared the planet
          </div>
          <div className={`text-4xl font-black tabular-nums ${meta.color}`}>
            {formatValue(saved)}
          </div>
          <div className="text-sm text-zinc-500 mt-0.5">
            {meta.unit} of {meta.label.toLowerCase()} not emitted
          </div>
          {ctx && saved > 0 && (
            <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed">
              {ctx.template.replace('{v}', ctx.convert(saved))}
            </p>
          )}
        </motion.div>

        {/* Animal toll */}
        <motion.div
          initial={stagedEntry ? { opacity: 0 } : false}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="border border-zinc-800 rounded-2xl p-4 space-y-3"
        >
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">
            Animal Toll
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-emerald-500">0</span>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-200 leading-tight">
                No animals died for this meal.
              </div>
              <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                {plantProteinCount > 1
                  ? `${plantProteinCount} beef patties would have contributed to the slaughter of cattle.`
                  : 'A beef patty would have contributed to the slaughter of a cattle.'}
                {' '}
                9 are killed every second globally.
              </div>
            </div>
          </div>
          <div className="pt-1 border-t border-zinc-800/50">
            <p className="text-[10px] text-zinc-700 leading-relaxed">
              ~9.47 cattle · 1,940 chickens · 46 pigs die globally every single second — 24 hours a day, 365 days a year.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={stagedEntry ? { y: 30, opacity: 0 } : false}
        animate={{ y: ready ? 0 : 30, opacity: ready ? 1 : 0 }}
        transition={SPRING.FOOTER}
        className="shrink-0 border-t border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm"
      >
        <button
          onClick={() => navigate('/impact', { state: { stagedEntry: false } })}
          className="w-full py-3 bg-zinc-100 text-zinc-950 rounded-full text-sm font-black hover:bg-white transition-colors mb-3"
        >
          See my full impact →
        </button>
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              resetForBuilder();
              navigate('/build');
            }}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-400 text-xs font-bold transition-colors"
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

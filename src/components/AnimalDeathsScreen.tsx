import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SPECIES } from '../data/animalDeaths';
import { SourcesTooltip } from './SourcesTooltip';
import { useCanvasAnimation, VIS } from '../hooks/useCanvasAnimation';
import { useBurgerStore } from '../store/useBurgerStore';
import { isVeganBurger } from '../utils/vegan';
import { DUR } from '../constants/animations';

function formatCount(n: number): string {
  return Math.floor(n).toLocaleString();
}

export const AnimalDeathsScreen = () => {
  const navigate = useNavigate();
  const { burgerState } = useBurgerStore();

  const onBack = () => navigate('/impact');

  const { canvasRef, wrapRef, elapsedSec } = useCanvasAnimation();

  const activeIngs = new Set(
    Object.values(burgerState).filter(Boolean) as string[],
  );
  const highlighted = new Set(
    SPECIES.flatMap((sp, i) =>
      sp.ingredientIds.some((id) => activeIngs.has(id)) ? [i] : [],
    ),
  );

  const proteinId = burgerState.protein1;
  const isPlantBurger = isVeganBurger(burgerState);
  const hasBacon = activeIngs.has('bacon');
  const phase =
    elapsedSec < 10 ? 1 : elapsedSec < 22 ? 2 : elapsedSec < 40 ? 3 : 4;

  const rotatingNotes = useMemo(() => {
    let firstNote: string;
    if (isPlantBurger) {
      firstNote =
        'This build uses plant protein. The animation shows the global meat-system count still moving around that choice.';
    } else if (proteinId === 'beefPatty') {
      firstNote =
        'Beef is in this build. Global cattle slaughter runs at about 9 animals every second.';
    } else if (
      proteinId === 'grilledChicken' ||
      proteinId === 'crispyChicken'
    ) {
      firstNote =
        'Chicken is in this build. The poultry count moves fastest because tens of billions are slaughtered each year.';
    } else if (hasBacon) {
      firstNote =
        'Bacon is in this build. Pig slaughter adds up at roughly 46 animals every second worldwide.';
    } else {
      firstNote =
        'These are global slaughter estimates. The count keeps moving whether or not it is visible on a menu.';
    }

    return [
      firstNote,
      'Every strip stands in for many deaths. The visual density is scaled so the page can keep up with the real count.',
      'The chicken column rises fastest because global poultry slaughter is measured in thousands per second.',
      'The slower columns still compound quickly. Cattle, pigs, and ducks add up by the minute, hour, and day.',
      'Plant choices do not erase the global count, but they stop this build from adding direct demand for animal protein.',
    ];
  }, [hasBacon, isPlantBurger, proteinId]);

  const [noteIndex, setNoteIndex] = useState(0);

  useEffect(() => {
    setNoteIndex(0);
  }, [rotatingNotes]);

  useEffect(() => {
    const id = setInterval(() => {
      setNoteIndex((idx) => (idx + 1) % rotatingNotes.length);
    }, 8000);
    return () => clearInterval(id);
  }, [rotatingNotes.length]);

  return (
    <div className="flex flex-col h-full bg-[#09090b] overflow-hidden relative">
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-zinc-900 bg-[#09090b]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-400 text-[10px] font-bold uppercase tracking-widest transition-colors mb-2"
            >
              <ArrowLeft size={10} />
              Back
            </button>
            <h2 className="text-2xl font-black italic text-zinc-100 leading-[0.9] tracking-tight">
              OUT OF SIGHT,
              <br />
              OUT OF MIND.
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2 pt-0.5">
            <SourcesTooltip placement="below" align="right" />
            <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-mono">
              {phase < 4 ? `Phase ${phase}/4` : 'Still filling'}
            </span>
          </div>
        </div>
      </div>

      <div ref={wrapRef} className="flex-1 min-h-0 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute inset-x-0 top-0 z-10 pointer-events-none bg-gradient-to-b from-[#09090b] via-[#09090b]/90 to-transparent px-5 pt-4 pb-14">
          <p className="max-w-2xl text-[10px] uppercase tracking-[0.22em] text-zinc-600">
            Animals killed for food since you opened this app
          </p>

          <div className="mt-3 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-zinc-900/90 bg-zinc-900/90">
            {SPECIES.map((sp, idx) => {
              const count = sp.perSec * elapsedSec;
              const isHL = highlighted.has(idx);
              const v = VIS[idx];
              const deathsPerDrop = Math.round(sp.perSec / v.spawnPerSec);
              const segmentBg = isHL
                ? `rgba(${v.r}, ${v.g}, ${v.b}, 0.26)`
                : `rgba(${v.r}, ${v.g}, ${v.b}, 0.095)`;
              return (
                <div
                  key={sp.id}
                  className="min-w-0 px-2.5 py-2.5"
                  style={{ backgroundColor: segmentBg }}
                >
                  <span
                    className="block truncate text-[8px] font-black uppercase tracking-widest"
                    style={{ color: isHL ? '#fecaca' : '#52525b' }}
                  >
                    {sp.label}
                  </span>
                  <span
                    className="mt-1 block text-lg font-black tabular-nums leading-none"
                    style={{
                      color: isHL
                        ? '#fecaca'
                        : `rgb(${v.r + 30},${v.g + 20},${v.b + 20})`,
                    }}
                  >
                    {formatCount(count)}
                  </span>
                  <span className="mt-1 block truncate text-[8px] font-mono text-zinc-700 leading-none">
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

          <div className="mt-3 h-10 max-w-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={noteIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: DUR.NAV }}
                className="absolute max-w-3xl"
              >
                <span className="mr-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Did you know?
                </span>
                <span className="text-xs text-zinc-400 leading-relaxed">
                  {rotatingNotes[noteIndex]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div
          className="absolute inset-x-0 top-0 h-12 pointer-events-none z-[5] bg-gradient-to-b from-[#09090b] to-transparent"
          style={{ opacity: 0.72 }}
        />
      </div>
    </div>
  );
};

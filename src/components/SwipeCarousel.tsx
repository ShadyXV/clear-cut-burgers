import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INGREDIENTS } from '../data/ingredients';
import { SvgMap } from './ingredients/IngredientLibrary';

// Height-constrained SVG renderer for the carousel (w-full h-auto clips; h-full w-auto fits)
const CarouselSvg = ({ ingredientId, isTopBun }: { ingredientId: string; isTopBun: boolean }) => {
  const isBun = INGREDIENTS[ingredientId]?.category === 'bun';
  const lookupId = isBun ? `${ingredientId}_${isTopBun ? 'top' : 'bottom'}` : ingredientId;
  const SvgComponent = SvgMap[lookupId];
  if (!SvgComponent) return null;
  return (
    <svg
      viewBox="0 0 320 160"
      className="h-full w-auto max-w-full"
      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))' }}
    >
      <SvgComponent />
    </svg>
  );
};

interface SwipeCarouselProps {
  options: (string | null)[];
  value: string | null;
  onChange: (val: string | null, direction: number) => void;
  showTopBun?: boolean;
}

const NoneCard = ({ full }: { full: boolean }) => (
  <div className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 h-full ${full ? 'gap-1' : ''}`}>
    {full && <span className="text-zinc-600 text-xl leading-none">—</span>}
    {full && <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">None</span>}
  </div>
);

const IngredientCard = ({ id, full, showTopBun }: { id: string; full: boolean; showTopBun: boolean }) => {
  const ingredient = INGREDIENTS[id];
  return (
    <div className={`flex flex-col items-center rounded-xl border border-zinc-800/60 bg-zinc-900/70 h-full ${full ? 'p-2 gap-1' : 'p-1'}`}>
      {/* flex-1 min-h-0 gives this div a constrained height; SVG sizes from h-full, not width */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <CarouselSvg ingredientId={id} isTopBun={showTopBun} />
      </div>
      {full && ingredient && (
        <span className="text-[11px] font-bold text-zinc-300 text-center leading-tight shrink-0 px-1">
          {ingredient.name}
        </span>
      )}
    </div>
  );
};

export const SwipeCarousel = ({ options, value, onChange, showTopBun = false }: SwipeCarouselProps) => {
  const [dir, setDir] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const rawIdx = options.indexOf(value);
  const idx = rawIdx === -1 ? 0 : rawIdx;
  const prevIdx = (idx - 1 + options.length) % options.length;
  const nextIdx = (idx + 1) % options.length;

  const goTo = (newIdx: number, direction: number) => {
    const wrapped = (newIdx + options.length) % options.length;
    setDir(direction);
    onChange(options[wrapped], direction);
  };

  const renderCard = (optId: string | null, full: boolean) =>
    optId === null
      ? <NoneCard full={full} />
      : <IngredientCard id={optId} full={full} showTopBun={showTopBun} />;

  const handlePointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    startX.current = null;
    startY.current = null;

    // Vertical motion dominant → ignore (browser scroll)
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (Math.abs(dx) < 25) {
      // Treat as tap — navigate via peek zones
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const relX = e.clientX - rect.left;
      if (relX < rect.width * 0.21) goTo(prevIdx, -1);
      else if (relX > rect.width * 0.79) goTo(nextIdx, 1);
      return;
    }

    // Horizontal swipe
    if (dx < 0) goTo(nextIdx, 1);
    else goTo(prevIdx, -1);
  };

  const handlePointerCancel = () => {
    startX.current = null;
    startY.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ height: 148, touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* Left peek */}
      <div className="absolute top-2 left-0 w-[18%] h-[calc(100%-16px)] opacity-30 pointer-events-none z-10">
        <div className="h-full -translate-x-1/2">
          {renderCard(options[prevIdx], false)}
        </div>
      </div>

      {/* Center */}
      <div className="absolute top-1 left-[18%] w-[64%] h-[calc(100%-8px)] pointer-events-none z-20 px-2">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={`${idx}-${String(options[idx])}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 48, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -48, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="h-full"
          >
            {renderCard(options[idx], true)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right peek */}
      <div className="absolute top-2 right-0 w-[18%] h-[calc(100%-16px)] opacity-30 pointer-events-none z-10">
        <div className="h-full translate-x-1/2">
          {renderCard(options[nextIdx], false)}
        </div>
      </div>
    </div>
  );
};

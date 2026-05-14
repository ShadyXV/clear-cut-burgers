import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FACTS } from '../data/facts';

interface RotatingFactProps {
  intervalMs?: number;
  className?: string;
}

export const RotatingFact = ({ intervalMs = 6000, className = '' }: RotatingFactProps) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % FACTS.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div className={`relative h-8 overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0 flex items-center"
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mr-2 shrink-0">Did you know?</span>
          <span className="text-[11px] text-zinc-400 italic leading-snug">{FACTS[idx]}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

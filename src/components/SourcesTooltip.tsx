import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

export const SourcesTooltip = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider font-bold transition-colors"
      >
        <Info size={10} />
        Sources
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 z-30 w-64 bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Sources</p>
          <ul className="space-y-1.5 text-[10px] text-zinc-400 leading-snug">
            <li>Poore & Nemecek (2018), <em>Science</em> — meta-analysis of 38,700 farms</li>
            <li>FAO global slaughter statistics (2023)</li>
            <li>Our World in Data — Food & Environment</li>
            <li>Water Footprint Network</li>
          </ul>
        </div>
      )}
    </div>
  );
};

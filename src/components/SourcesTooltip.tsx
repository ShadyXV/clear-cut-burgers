import { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';

interface SourcesTooltipProps {
  placement?: 'above' | 'below';
  align?: 'left' | 'right';
}

export const SourcesTooltip = ({
  placement = 'above',
  align = 'left',
}: SourcesTooltipProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelPosition =
    placement === 'below' ? 'top-full mt-2' : 'bottom-full mb-2';
  const panelAlign = align === 'right' ? 'right-0' : 'left-0';

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
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-wider font-bold transition-colors"
      >
        <Info size={10} />
        Sources
      </button>
      {open && (
        <div
          className={`absolute ${panelPosition} ${panelAlign} z-30 w-72 rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl`}
        >
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Sources
          </p>
          <ul className="space-y-1.5 text-[10px] text-zinc-400 leading-snug">
            <li>
              Poore & Nemecek (2018), <em>Science</em>: meta-analysis of about
              38,700 farms and 1,600 processors, retailers, and packaging types
            </li>
            <li>
              Our World in Data food-footprint datasets: greenhouse gas
              emissions, land use, and freshwater withdrawals per kg of food
            </li>
            <li>
              Searchinger et al. (2018), processed by Our World in Data: carbon
              opportunity costs for the forest/land proxy
            </li>
            <li>
              Plant-patty land estimates use cooked-patty dry-crop equivalents,
              checked against published plant-burger LCAs
            </li>
            <li>
              FAO global slaughter statistics for the animal-deaths screen
            </li>
            <li>
              Methane and feed figures are simplified app estimates. Plant
              methane values are trace estimates, not hard zeroes.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, Plus } from 'lucide-react';
import { INGREDIENTS } from '../../data/ingredients';

export const SectionWrap = ({
  hint,
  children,
}: {
  hint: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-3 px-6 py-3 h-full overflow-y-auto">
    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center shrink-0">
      {hint}
    </p>
    {children}
  </div>
);

export const AddButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="w-full py-2.5 border border-dashed border-amber-500/40 text-amber-500 text-xs font-bold rounded-xl hover:bg-amber-500/10 active:bg-amber-500/15 transition-colors flex items-center justify-center gap-1.5 shrink-0"
  >
    <Plus size={13} />
    {children}
  </button>
);

export const SlotDropdown = ({
  label,
  options,
  value,
  onRemove,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onRemove: () => void;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800 shrink-0">
    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold w-16 shrink-0">
      {label}
    </span>
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-transparent text-zinc-200 text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
    >
      {options.map((id) => (
        <option key={id} value={id} className="bg-zinc-900 text-zinc-200">
          {INGREDIENTS[id]?.name}
        </option>
      ))}
    </select>
    <button
      onClick={onRemove}
      className="text-zinc-500 hover:text-red-400 transition-colors shrink-0 p-1 rounded-lg hover:bg-red-900/20"
    >
      <X size={14} />
    </button>
  </div>
);

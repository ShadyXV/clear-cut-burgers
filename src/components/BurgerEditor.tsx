import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, INGREDIENTS, Category, SlotKey } from '../data/ingredients';
import { SwipeCarousel } from './SwipeCarousel';

interface EditorProps {
  burgerState: Record<string, string | null>;
  onChangeSlot: (slotId: SlotKey, val: string | null, direction: number) => void;
}

const CategoryTabs: { id: Category; label: string }[] = [
  { id: 'bun', label: 'Buns' },
  { id: 'protein', label: 'Proteins' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'topping', label: 'Toppings' },
  { id: 'sauce', label: 'Sauces' },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

const SectionWrap = ({ hint, children }: { hint: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 px-6 py-3 h-full overflow-y-auto">
    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-center shrink-0">{hint}</p>
    {children}
  </div>
);

const AddButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="w-full py-2.5 border border-dashed border-amber-500/40 text-amber-500 text-xs font-bold rounded-xl hover:bg-amber-500/10 active:bg-amber-500/15 transition-colors flex items-center justify-center gap-1.5 shrink-0"
  >
    <Plus size={13} />
    {children}
  </button>
);

const SlotDropdown = ({
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
    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold w-16 shrink-0">{label}</span>
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

// ─── Category sections ────────────────────────────────────────────────────────

const BunSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const handleChange = (val: string | null, dir: number) => {
    if (!val) return;
    onChangeSlot('bunTop', val, dir);
    onChangeSlot('bunBottom', val, dir);
  };
  const currentName = burgerState.bunTop ? INGREDIENTS[burgerState.bunTop]?.name : '—';

  return (
    <SectionWrap hint="Swipe to select your bun">
      <SwipeCarousel
        options={CATEGORIES.bun}
        value={burgerState.bunTop}
        onChange={handleChange}
        showTopBun
      />
      <p className="text-center font-bold text-base text-zinc-100 shrink-0">{currentName}</p>
    </SectionWrap>
  );
};

const ProteinSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const addSecond = () => onChangeSlot('protein2', CATEGORIES.protein[0], 1);
  const addThird = () => onChangeSlot('protein3', CATEGORIES.protein[0], 1);

  return (
    <SectionWrap hint="Swipe to choose your protein">
      <SwipeCarousel
        options={CATEGORIES.protein}
        value={burgerState.protein1}
        onChange={(v, d) => onChangeSlot('protein1', v ?? CATEGORIES.protein[0], d)}
      />
      <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
        {burgerState.protein1 ? INGREDIENTS[burgerState.protein1]?.name : ''}
      </p>

      {burgerState.protein1 && (
        <>
          {burgerState.protein2 ? (
            <>
              <SlotDropdown
                label="2nd Patty"
                options={CATEGORIES.protein}
                value={burgerState.protein2}
                onRemove={() => {
                  onChangeSlot('protein2', null, 1);
                  onChangeSlot('protein3', null, 1);
                }}
                onChange={(v) => onChangeSlot('protein2', v, 1)}
              />
              {burgerState.protein3 ? (
                <SlotDropdown
                  label="3rd Patty"
                  options={CATEGORIES.protein}
                  value={burgerState.protein3}
                  onRemove={() => onChangeSlot('protein3', null, 1)}
                  onChange={(v) => onChangeSlot('protein3', v, 1)}
                />
              ) : (
                <AddButton onClick={addThird}>Add a 3rd Patty</AddButton>
              )}
            </>
          ) : (
            <AddButton onClick={addSecond}>Add a 2nd Patty</AddButton>
          )}
        </>
      )}
    </SectionWrap>
  );
};

const CheeseSection = ({ burgerState, onChangeSlot }: EditorProps) => (
  <SectionWrap hint="Add cheese to your burger">
    <SwipeCarousel
      options={[null, ...CATEGORIES.cheese]}
      value={burgerState.cheese1}
      onChange={(v, d) => onChangeSlot('cheese1', v, d)}
    />
    <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
      {burgerState.cheese1 ? INGREDIENTS[burgerState.cheese1]?.name : 'No Cheese'}
    </p>

    {burgerState.cheese1 && (
      burgerState.cheese2 ? (
        <SlotDropdown
          label="Extra"
          options={CATEGORIES.cheese}
          value={burgerState.cheese2}
          onRemove={() => onChangeSlot('cheese2', null, 1)}
          onChange={(v) => onChangeSlot('cheese2', v, 1)}
        />
      ) : (
        <AddButton onClick={() => onChangeSlot('cheese2', CATEGORIES.cheese[0], 1)}>
          Add Another Cheese
        </AddButton>
      )
    )}
  </SectionWrap>
);

const TOPPING_SLOTS: SlotKey[] = ['topping1', 'topping2', 'topping3', 'topping4', 'topping5', 'topping6'];

const ToppingSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const filledCount = TOPPING_SLOTS.filter((s) => burgerState[s]).length;

  const addTopping = () => {
    const next = TOPPING_SLOTS.find((s) => !burgerState[s]);
    if (next) onChangeSlot(next, CATEGORIES.topping[0], 1);
  };

  // Cascade-remove: when removing slot N, shift N+1..6 down by one.
  const removeTopping = (slotId: SlotKey) => {
    const fromIdx = TOPPING_SLOTS.indexOf(slotId);
    for (let i = fromIdx; i < TOPPING_SLOTS.length; i++) {
      const next = TOPPING_SLOTS[i + 1];
      onChangeSlot(TOPPING_SLOTS[i], next ? burgerState[next] : null, 1);
    }
  };

  return (
    <SectionWrap hint="Swipe to choose a topping">
      <SwipeCarousel
        options={[null, ...CATEGORIES.topping]}
        value={burgerState.topping1}
        onChange={(v, d) => {
          // If user removes topping1, cascade the rest down
          if (v === null && burgerState.topping2) {
            removeTopping('topping1');
          } else {
            onChangeSlot('topping1', v, d);
          }
        }}
      />
      <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
        {burgerState.topping1 ? INGREDIENTS[burgerState.topping1]?.name : 'No Topping'}
      </p>

      <div className="space-y-2 shrink-0">
        {TOPPING_SLOTS.slice(1).map((slotId) => {
          if (!burgerState[slotId]) return null;
          const num = slotId.replace('topping', '');
          return (
            <SlotDropdown
              key={slotId}
              label={`Topping ${num}`}
              options={CATEGORIES.topping}
              value={burgerState[slotId]}
              onRemove={() => removeTopping(slotId)}
              onChange={(v) => onChangeSlot(slotId, v, 1)}
            />
          );
        })}

        {burgerState.topping1 && filledCount < 6 && (
          <AddButton onClick={addTopping}>Add a Topping</AddButton>
        )}
      </div>
    </SectionWrap>
  );
};

const SauceSection = ({ burgerState, onChangeSlot }: EditorProps) => (
  <SectionWrap hint="Choose your sauce">
    <SwipeCarousel
      options={[null, ...CATEGORIES.sauce]}
      value={burgerState.sauceBottom}
      onChange={(v, d) => onChangeSlot('sauceBottom', v, d)}
    />
    <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
      {burgerState.sauceBottom ? INGREDIENTS[burgerState.sauceBottom]?.name : 'No Sauce'}
    </p>
  </SectionWrap>
);

// ─── Main editor ──────────────────────────────────────────────────────────────

export const BurgerEditor = ({ burgerState, onChangeSlot }: EditorProps) => {
  const [activeTab, setActiveTab] = useState<Category>('protein');

  return (
    <div className="w-full flex-1 min-h-0 glass border-t border-zinc-800 flex flex-col z-50">
      {/* Tabs */}
      <div className="flex overflow-x-auto px-4 pt-2 border-b border-zinc-800 no-scrollbar gap-1 shrink-0">
        {CategoryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-bold text-xs tracking-widest uppercase transition-colors border-b-2 flex-shrink-0 ${
              activeTab === tab.id
                ? 'text-amber-500 border-amber-500'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.14 }}
            className="absolute inset-0"
          >
            {activeTab === 'bun' && <BunSection burgerState={burgerState} onChangeSlot={onChangeSlot} />}
            {activeTab === 'protein' && <ProteinSection burgerState={burgerState} onChangeSlot={onChangeSlot} />}
            {activeTab === 'cheese' && <CheeseSection burgerState={burgerState} onChangeSlot={onChangeSlot} />}
            {activeTab === 'topping' && <ToppingSection burgerState={burgerState} onChangeSlot={onChangeSlot} />}
            {activeTab === 'sauce' && <SauceSection burgerState={burgerState} onChangeSlot={onChangeSlot} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

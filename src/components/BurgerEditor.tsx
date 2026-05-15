import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, SlotKey } from '../data/ingredients';
import { DUR } from '../constants/animations';
import { BunSection } from './editor/BunSection';
import { ProteinSection } from './editor/ProteinSection';
import { CheeseSection } from './editor/CheeseSection';
import { ToppingSection } from './editor/ToppingSection';
import { SauceSection } from './editor/SauceSection';

interface EditorProps {
  burgerState: Record<string, string | null>;
  onChangeSlot: (
    slotId: SlotKey,
    val: string | null,
    direction: number,
  ) => void;
}

const CategoryTabs: { id: Category; label: string }[] = [
  { id: 'bun', label: 'Buns' },
  { id: 'protein', label: 'Proteins' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'topping', label: 'Toppings' },
  { id: 'sauce', label: 'Sauces' },
];

export const BurgerEditor = ({ burgerState, onChangeSlot }: EditorProps) => {
  const [activeTab, setActiveTab] = useState<Category>('protein');

  return (
    <div className="w-full flex-1 min-h-0 glass border-t border-zinc-800 flex flex-col z-50">
      {/* Tabs */}
      <div className="flex overflow-x-auto px-4 pt-1 border-b border-zinc-800 no-scrollbar gap-1 shrink-0">
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
            transition={{ duration: DUR.FAST }}
            className="absolute inset-0"
          >
            {activeTab === 'bun' && (
              <BunSection
                burgerState={burgerState}
                onChangeSlot={onChangeSlot}
              />
            )}
            {activeTab === 'protein' && (
              <ProteinSection
                burgerState={burgerState}
                onChangeSlot={onChangeSlot}
              />
            )}
            {activeTab === 'cheese' && (
              <CheeseSection
                burgerState={burgerState}
                onChangeSlot={onChangeSlot}
              />
            )}
            {activeTab === 'topping' && (
              <ToppingSection
                burgerState={burgerState}
                onChangeSlot={onChangeSlot}
              />
            )}
            {activeTab === 'sauce' && (
              <SauceSection
                burgerState={burgerState}
                onChangeSlot={onChangeSlot}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

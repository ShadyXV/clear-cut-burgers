import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CATEGORIES, INGREDIENTS, Category, SlotKey, BURGER_SLOTS } from '../data/ingredients';

interface EditorProps {
  burgerState: Record<string, string | null>;
  onChangeSlot: (slotId: SlotKey, val: string | null, direction: number) => void;
}

const CategoryTabs: { id: Category, label: string }[] = [
  { id: 'bun', label: 'Buns' },
  { id: 'protein', label: 'Proteins' },
  { id: 'cheese', label: 'Cheese' },
  { id: 'topping', label: 'Toppings' },
  { id: 'sauce', label: 'Sauces' },
];

export const BurgerEditor = ({ burgerState, onChangeSlot }: EditorProps) => {
  const [activeTab, setActiveTab] = useState<Category>('protein');

  const handleClearSlot = (slotId: SlotKey) => {
    onChangeSlot(slotId, null, 1);
  };

  const getSlotOptions = (category: Category, isOptional: boolean = false) => {
     const opts: (string | null)[] = CATEGORIES[category];
     if (isOptional) {
        return [null, ...opts];
     }
     return opts;
  };

  const relevantSlots = BURGER_SLOTS.filter(s => s.category === activeTab);

  return (
    <div className="w-full md:w-[450px] glass border-l border-zinc-800 flex flex-col z-50">
      
      {/* Header Tabs */}
      <div className="flex overflow-x-auto p-4 border-b border-zinc-800 no-scrollbar gap-2">
         {CategoryTabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`px-4 py-2 font-bold text-sm tracking-widest uppercase transition-colors border-b-2 flex-shrink-0 ${
               activeTab === tab.id 
                 ? 'text-amber-500 border-amber-500' 
                 : 'text-zinc-500 border-transparent hover:text-zinc-300'
             }`}
           >
             {tab.label}
           </button>
         ))}
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
         <AnimatePresence mode="popLayout">
           <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
           >
              {activeTab === 'bun' && (
                <BunController burgerState={burgerState} onChangeSlot={onChangeSlot} />
              )}
              
              {activeTab !== 'bun' && relevantSlots.map(slot => {
                 const isOptional = !slot.label.includes("1") && slot.id !== 'bunBottom' && slot.id !== 'bunTop'; // Only first slot required, rest max
                 const options = getSlotOptions(activeTab, isOptional);
                 
                 // Progressive disclosure: only show slot N if N-1 is filled
                 if (slot.id.includes('2') && !burgerState[slot.id.replace('2', '1')]) return null;
                 if (slot.id.includes('3') && !burgerState[slot.id.replace('3', '2')]) return null;
                 if (slot.id.includes('4') && !burgerState[slot.id.replace('4', '3')]) return null;
                 if (slot.id.includes('5') && !burgerState[slot.id.replace('5', '4')]) return null;
                 if (slot.id.includes('6') && !burgerState[slot.id.replace('6', '5')]) return null;

                 return (
                   <div key={slot.id} className="space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">{slot.label}</label>
                        {isOptional && burgerState[slot.id] && (
                           <button onClick={() => handleClearSlot(slot.id)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium bg-red-900/20 px-2 py-1 rounded-md">
                             <X size={14} /> Remove
                           </button>
                        )}
                      </div>
                      <Carousel 
                         options={options} 
                         value={burgerState[slot.id]} 
                         onChange={(val, dir) => onChangeSlot(slot.id as SlotKey, val, dir)} 
                      />
                   </div>
                 );
              })}
           </motion.div>
         </AnimatePresence>
      </div>

    </div>
  );
};

// Bun is special because top/bottom must match in the UI, though they use different slots to render.
const BunController = ({ burgerState, onChangeSlot }: EditorProps) => {
   // determine current bun pair based on top bun
   const currentBun = burgerState['bunTop']; 

   const handleBunChange = (val: string | null, dir: number) => {
      onChangeSlot('bunTop', val, dir);
      onChangeSlot('bunBottom', val, dir);
   };

   return (
      <div className="space-y-2">
         <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] px-1">Bun Choice</label>
         <Carousel 
            options={CATEGORIES.bun} 
            value={currentBun} 
            onChange={handleBunChange} 
         />
      </div>
   );
};


const Carousel = ({ options, value, onChange }: { options: (string | null)[], value: string | null, onChange: (val: string | null, direction: number) => void }) => {
   const currentIndex = options.indexOf(value);
   
   const handlePrev = () => {
      let nextIdx = currentIndex - 1;
      if (nextIdx < 0) nextIdx = options.length - 1;
      onChange(options[nextIdx], -1);
   };

   const handleNext = () => {
      let nextIdx = currentIndex + 1;
      if (nextIdx >= options.length) nextIdx = 0;
      onChange(options[nextIdx], 1);
   };

   return (
      <div className="flex items-center justify-between p-3 glass border border-zinc-800 rounded-xl overflow-hidden relative">
         <button onClick={handlePrev} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors z-10 shrink-0 select-none cursor-pointer">
            <ChevronLeft size={20} />
         </button>
         
         {/* The visual swiper container. */}
         <div className="flex-1 overflow-hidden font-bold text-[#fafafa] text-center relative h-6 flex justify-center items-center">
            <AnimatePresence mode="popLayout" initial={false}>
               <motion.div
                  key={value || 'none'}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute"
               >
                  {value ? INGREDIENTS[value]?.name : <span className="text-zinc-500 font-medium">None</span>}
               </motion.div>
            </AnimatePresence>
         </div>
         
         <button onClick={handleNext} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors z-10 shrink-0 select-none cursor-pointer">
            <ChevronRight size={20} />
         </button>
      </div>
   );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BurgerStack } from './components/BurgerStack';
import { BurgerEditor } from './components/BurgerEditor';
import { SlotKey } from './data/ingredients';

export default function App() {
  const [direction, setDirection] = useState(1);
  const [isAssembled, setIsAssembled] = useState(false);
  const [burgerState, setBurgerState] = useState<Record<string, string | null>>({
    bunTop: 'brioche',
    topping6: null,
    topping5: null,
    topping4: null,
    topping3: null,
    topping2: null,
    topping1: 'tomato',
    cheese2: null,
    cheese1: 'cheddar',
    protein3: null,
    protein2: null,
    protein1: 'beefPatty',
    sauceBottom: 'sauceMayo',
    bunBottom: 'brioche',
  });

  const handleSlotChange = (slotId: SlotKey, val: string | null, dir: number) => {
    setDirection(dir);
    setBurgerState(prev => ({
      ...prev,
      [slotId]: val
    }));
    if (isAssembled) {
       setIsAssembled(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#09090b] text-[#fafafa] overflow-hidden font-sans">
      
      {/* Navigation Bar */}
      <nav className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 relative z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-zinc-950">B</div>
          <span className="text-lg font-semibold tracking-tight">STACK MASTER <span className="text-zinc-500 font-normal">LABS</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
            2D RENDER ENGINE ACTIVE
          </div>
          <button 
            onClick={() => setIsAssembled(!isAssembled)}
            className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-bold hover:bg-white transition-colors"
          >
            {isAssembled ? "EDIT BURGER" : "CHECKOUT — $18.50"}
          </button>
        </div>
      </nav>

      {/* Main Layout Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-0">
        {/* 2D Burger View Canvas */}
        <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-12 left-12">
              <h1 className="text-5xl font-black italic text-zinc-800 leading-none mb-1">THE GOLIATH</h1>
              <p className="text-amber-500/50 font-mono text-sm tracking-tighter">ID: #BM-80822-XP</p>
           </div>
           <div className="absolute bottom-12 right-12 text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Total Nutrition</p>
              <p className="text-3xl font-bold">1,142 <span className="text-lg font-normal text-zinc-400">KCAL</span></p>
           </div>
  
           {/* The Burger */}
           <div className="relative z-10 w-full h-full flex justify-center items-center">
               <BurgerStack burgerState={burgerState} direction={direction} isAssembled={isAssembled} />
           </div>
        </div>
  
        {/* Editor Panel */}
        <BurgerEditor burgerState={burgerState} onChangeSlot={handleSlotChange} />
      </main>
    </div>
  );
}

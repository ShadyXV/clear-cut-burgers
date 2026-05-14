/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BurgerStack } from './components/BurgerStack';
import { BurgerEditor } from './components/BurgerEditor';
import { ImpactScreen } from './components/ImpactScreen';
import { AnimalDeathsScreen } from './components/AnimalDeathsScreen';
import { CheckoutTransition } from './components/CheckoutTransition';
import { SlotKey } from './data/ingredients';

type AppView = 'builder' | 'checkoutTransition' | 'impact' | 'deaths';

// View depth controls slide direction for horizontal page transitions.
const VIEW_DEPTH: Record<AppView, number> = {
  builder: 0,
  checkoutTransition: 0.5,
  impact: 1,
  deaths: 2,
};

export default function App() {
  const [direction, setDirection] = useState(1);
  const [view, setView] = useState<AppView>('builder');
  const [prevView, setPrevView] = useState<AppView>('builder');
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

  const navigateTo = (next: AppView) => {
    setPrevView(view);
    setView(next);
  };

  const slideDir = VIEW_DEPTH[view] > VIEW_DEPTH[prevView] ? 1 : -1;

  // When Impact is entered from the cinematic, fade-in (no slide).
  const impactFromCinematic = prevView === 'checkoutTransition';

  const handleSlotChange = (slotId: SlotKey, val: string | null, dir: number) => {
    setDirection(dir);
    setBurgerState(prev => ({
      ...prev,
      [slotId]: val
    }));
  };

  const navLabel = view === 'builder' ? 'CHECKOUT — $18.50' : 'EDIT BURGER';

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
            onClick={() => {
              if (view === 'builder') {
                navigateTo('checkoutTransition');
              } else {
                navigateTo('builder');
              }
            }}
            disabled={view === 'checkoutTransition'}
            className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-bold hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {navLabel}
          </button>
        </div>
      </nav>

      {/* Main Layout Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-0 min-h-0">
        <AnimatePresence mode="wait" initial={false} custom={slideDir}>
          {view === 'builder' && (
            <motion.div
              key="builder"
              custom={slideDir}
              initial={{ x: `${slideDir * -100}%`, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: `${slideDir * -100}%`, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Burger Preview */}
              <div className="h-[44%] shrink-0 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black overflow-hidden">
                <div className="absolute top-4 left-6">
                  <h1 className="text-3xl font-black italic text-zinc-800 leading-none">THE GOLIATH</h1>
                  <p className="text-amber-500/50 font-mono text-xs tracking-tighter">ID: #BM-80822-XP</p>
                </div>
                <div className="absolute bottom-4 right-6 text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Nutrition</p>
                  <p className="text-xl font-bold">1,142 <span className="text-sm font-normal text-zinc-400">KCAL</span></p>
                </div>
                <div className="relative z-10 w-full h-full flex justify-center items-end overflow-hidden">
                  <BurgerStack burgerState={burgerState} direction={direction} isAssembled={false} isCompact />
                </div>
              </div>
              <BurgerEditor burgerState={burgerState} onChangeSlot={handleSlotChange} />
            </motion.div>
          )}

          {view === 'checkoutTransition' && (
            <motion.div
              key="checkoutTransition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40"
            >
              <CheckoutTransition
                burgerState={burgerState}
                onComplete={() => navigateTo('impact')}
              />
            </motion.div>
          )}

          {view === 'impact' && (
            <motion.div
              key="impact"
              custom={slideDir}
              initial={impactFromCinematic ? { opacity: 0 } : { x: `${slideDir * 100}%`, opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ x: `${slideDir * -100}%`, opacity: 0 }}
              transition={
                impactFromCinematic
                  ? { duration: 0.55 }
                  : { type: 'spring', stiffness: 260, damping: 28 }
              }
              className="absolute inset-0"
            >
              <ImpactScreen
                burgerState={burgerState}
                onBack={() => navigateTo('builder')}
                onViewDeaths={() => navigateTo('deaths')}
                stagedEntry={impactFromCinematic}
              />
            </motion.div>
          )}

          {view === 'deaths' && (
            <motion.div
              key="deaths"
              custom={slideDir}
              initial={{ x: `${slideDir * 100}%`, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: `${slideDir * 100}%`, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute inset-0"
            >
              <AnimalDeathsScreen
                burgerState={burgerState}
                onBack={() => navigateTo('impact')}
                onSwitchToPlant={() => {
                  setBurgerState(prev => ({ ...prev, protein1: 'blackBeanPatty' }));
                  navigateTo('builder');
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

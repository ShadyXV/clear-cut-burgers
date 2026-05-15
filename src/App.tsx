/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRING, EASE, DUR } from './constants/animations';
import { BurgerStack } from './components/BurgerStack';
import { BurgerEditor } from './components/BurgerEditor';
import { ImpactScreen } from './components/ImpactScreen';
import { AnimalDeathsScreen } from './components/AnimalDeathsScreen';
import { CheckoutTransition } from './components/CheckoutTransition';
import { SplashScreen } from './components/SplashScreen';
import { SlotKey, generateRandomBurgerState } from './data/ingredients';

// Checkout cinematic plays as an overlay inside the 'builder' view —
// no separate route, no unmount/remount of the burger.
type AppView = 'builder' | 'impact' | 'deaths';

const VIEW_DEPTH: Record<AppView, number> = {
  builder: 0,
  impact: 1,
  deaths: 2,
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [direction, setDirection] = useState(1);
  const [view, setView] = useState<AppView>('builder');
  const [prevView, setPrevView] = useState<AppView>('builder');
  // isDeparting drives all departure animation; checkout overlay lives inside builder.
  const [isDeparting, setIsDeparting] = useState(false);
  const [isAssembled, setIsAssembled] = useState(false);
  const [recoil, setRecoil] = useState(0);
  const [heroOpacity, setHeroOpacity] = useState(1);

  // Initialize with a random non-vegan burger
  const initialBurger = useMemo(() => generateRandomBurgerState(), []);
  const [burgerState, setBurgerState] =
    useState<Record<string, string | null>>(initialBurger);

  const navigateTo = (next: AppView) => {
    setPrevView(view);
    setView(next);
    // Reset assembly state when coming back to builder
    if (next === 'builder') {
      setIsAssembled(false);
      setIsDeparting(false);
      setRecoil(0);
      setHeroOpacity(1);
    }
  };

  const handleCheckoutPress = () => {
    if (view !== 'builder' || isDeparting) return;
    setIsAssembled(true);
    // Delay departure slightly so it collapses first, then moves
    setTimeout(() => {
      setIsDeparting(true);
    }, 400);
  };

  // Called by CheckoutTransition after all animation phases are done.
  const handleCheckoutComplete = () => {
    navigateTo('impact');
  };

  const slideDir = VIEW_DEPTH[view] > VIEW_DEPTH[prevView] ? 1 : -1;
  const navLabel = view === 'builder' ? 'ORDER NOW' : 'EDIT BURGER';

  const handleSlotChange = (
    slotId: SlotKey,
    val: string | null,
    dir: number,
  ) => {
    setDirection(dir);
    setBurgerState((prev) => ({ ...prev, [slotId]: val }));
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#09090b] text-[#fafafa] overflow-hidden font-sans">
      {/* Background content is always rendered now to allow for shared layout transition */}
      <div
        className={`flex flex-col h-full w-full transition-opacity duration-700 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* ── Nav — slides up gracefully at the start of checkout ── */}
        <motion.nav
          animate={{
            y: isDeparting ? '-120%' : 0,
            opacity: isDeparting ? 0 : 1,
          }}
          transition={{ duration: DUR.SLIDE, ease: EASE.SNAPPY }}
          className="h-16 flex items-center justify-between px-8 border-b border-zinc-800 bg-zinc-950/50 relative z-50 shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-zinc-950">
              B
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CLEAN CUT{' '}
              <span className="text-zinc-500 font-normal">BURGERS</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (view === 'builder') handleCheckoutPress();
                else navigateTo('builder');
              }}
              disabled={isDeparting}
              className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-bold hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {navLabel}
            </button>
          </div>
        </motion.nav>

        {/* ── Main workspace ── */}
        <main className="flex-1 flex flex-col overflow-hidden relative z-0 min-h-0">
          {/* THE HERO BURGER - Truly persistent across all views */}
          <div className="absolute inset-0 pointer-events-none flex justify-center overflow-visible z-0">
            <motion.div
              layout
              style={{
                zIndex: isDeparting ? 40 : 10,
                position: 'absolute',
                bottom: '50%',
              }}
              animate={{
                y: view !== 'builder' ? '100vh' : isDeparting ? '50%' : '2vh',
                scale: isDeparting ? 1.15 : 1,
                x: recoil * 8,
                opacity: view !== 'builder' ? 0 : isDeparting ? heroOpacity : 1,
              }}
              transition={{
                y: SPRING.HERO,
                scale: SPRING.HERO,
                x: SPRING.RECOIL,
                opacity: { duration: 0.4 },
              }}
              className="flex items-end justify-center"
            >
              <BurgerStack
                burgerState={burgerState}
                direction={direction}
                isAssembled={isAssembled}
                isCompact
              />
            </motion.div>
          </div>

          <AnimatePresence mode="wait" initial={false} custom={slideDir}>
            {view === 'builder' && (
              <motion.div
                key="builder"
                custom={slideDir}
                initial={{ x: `${slideDir * -100}%`, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                // Screen is already black from checkout dissolve — exit instantly.
                exit={{ opacity: 0, transition: { duration: DUR.INSTANT } }}
                transition={SPRING.VIEW}
                className="absolute inset-0 flex flex-col"
              >
                {/* ── Burger preview area (now just a background for the persistent burger) ── */}
                <div className="h-[54%] shrink-0 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 to-black overflow-hidden" />

                {/* ── Editor — slides down off screen during departure ── */}
                <motion.div
                  animate={{
                    y: isDeparting ? '100%' : '0%',
                    opacity: isDeparting ? 0 : 1,
                  }}
                  transition={{ duration: DUR.SLIDE, ease: EASE.SNAPPY }}
                  className="flex-1 overflow-hidden flex flex-col min-h-0"
                >
                  <BurgerEditor
                    burgerState={burgerState}
                    onChangeSlot={handleSlotChange}
                  />
                </motion.div>
              </motion.div>
            )}

            {view === 'impact' && (
              <motion.div
                key="impact"
                custom={slideDir}
                initial={{
                  opacity: 0,
                  x: prevView === 'builder' ? 0 : `${slideDir * 100}%`,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ x: `${slideDir * -100}%`, opacity: 0 }}
                transition={
                  prevView === 'builder'
                    ? { duration: DUR.IMPACT }
                    : SPRING.VIEW
                }
                className="absolute inset-0"
              >
                <ImpactScreen
                  burgerState={burgerState}
                  onBack={() => navigateTo('builder')}
                  onViewDeaths={() => navigateTo('deaths')}
                  stagedEntry={prevView === 'builder'}
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
                transition={SPRING.VIEW}
                className="absolute inset-0"
              >
                <AnimalDeathsScreen
                  burgerState={burgerState}
                  onBack={() => navigateTo('impact')}
                  onSwitchToPlant={() => {
                    setBurgerState((prev) => ({
                      ...prev,
                      protein1: 'blackBeanPatty',
                    }));
                    navigateTo('builder');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* CheckoutTransition lives OUTSIDE AnimatePresence so it persists
              through the builder→impact view swap and can crossfade cleanly. */}
          <AnimatePresence>
            {isDeparting && (
              <CheckoutTransition
                key="checkout-overlay"
                burgerState={burgerState}
                onComplete={handleCheckoutComplete}
                onStateChange={(r, o) => {
                  setRecoil(r);
                  setHeroOpacity(o);
                }}
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Splash overlay — sits above everything, slides up on dismiss */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            key="splash"
            burgerState={burgerState}
            onStart={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

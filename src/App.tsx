/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skull, Sprout } from 'lucide-react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { SPRING, EASE, DUR } from './constants/animations';
import { BurgerStack } from './components/BurgerStack';
import { CheckoutTransition } from './components/CheckoutTransition';
import { SplashScreen } from './components/SplashScreen';
import { useBurgerStore } from './store/useBurgerStore';

type AppView = 'splash' | 'build' | 'checkout' | 'impact' | 'deaths';

const VIEW_DEPTH: Record<AppView, number> = {
  splash: 0,
  build: 1,
  checkout: 2,
  impact: 3,
  deaths: 4,
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  const view: AppView =
    location.pathname === '/'
      ? 'splash'
      : location.pathname === '/build'
        ? 'build'
        : location.pathname === '/checkout'
          ? 'checkout'
          : location.pathname === '/impact'
            ? 'impact'
            : 'deaths';

  const [prevView, setPrevView] = useState<AppView>(view);

  const {
    burgerState,
    direction,
    isAssembled,
    recoil,
    heroOpacity,
    setIsAssembled,
    setSlot,
    setRecoil,
    setHeroOpacity,
    resetForBuilder,
  } = useBurgerStore();

  useEffect(() => {
    if (view !== prevView) {
      setPrevView(view);
    }
  }, [view, prevView]);

  const slideDir = VIEW_DEPTH[view] > VIEW_DEPTH[prevView] ? 1 : -1;

  const isCheckout = view === 'checkout';
  const isSplash = view === 'splash';

  const handleCheckoutPress = () => {
    if (view !== 'build') return;
    setIsAssembled(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 400);
  };

  const handleCheckoutComplete = () => {
    navigate('/impact', { state: { stagedEntry: true } });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#09090b] text-[#fafafa] overflow-hidden font-sans">
      <motion.nav
        animate={{
          y: isSplash || isCheckout ? '-120%' : 0,
          opacity: isSplash || isCheckout ? 0 : 1,
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
          {view === 'impact' ? (
            <button
              onClick={() => navigate('/deaths')}
              className="px-5 py-2 border border-amber-500 text-amber-400 rounded-full text-sm font-bold hover:bg-amber-500/10 transition-colors flex items-center gap-2"
            >
              <Skull size={14} />
              SEE THE ANIMAL TOLL
            </button>
          ) : view === 'deaths' ? (
            !['blackBeanPatty', 'chickpeaPatty', 'mushroomPatty'].includes(burgerState.protein1 ?? '') && (
              <button
                onClick={() => {
                  setSlot('protein1', 'blackBeanPatty', 1);
                  resetForBuilder();
                  navigate('/build');
                }}
                className="px-5 py-2 border border-amber-500 text-amber-400 rounded-full text-sm font-bold hover:bg-amber-500/10 transition-colors flex items-center gap-2"
              >
                <Sprout size={14} />
                Try a plant-based burger
              </button>
            )
          ) : (
            <button
              onClick={() => {
                if (view === 'build') handleCheckoutPress();
                else {
                  resetForBuilder();
                  navigate('/build');
                }
              }}
              className="px-5 py-2 bg-zinc-100 text-zinc-950 rounded-full text-sm font-bold hover:bg-white transition-colors"
            >
              {view === 'build' ? 'ORDER NOW' : 'EDIT BURGER'}
            </button>
          )}
        </div>
      </motion.nav>

      <main className="flex-1 flex flex-col overflow-hidden relative z-0 min-h-0">
        <div className="absolute inset-0 pointer-events-none flex justify-center overflow-visible z-0">
          <motion.div
            layout
            style={{
              zIndex: isCheckout ? 40 : 10,
              position: 'absolute',
              bottom: '50%',
            }}
            animate={{
              y: view === 'build' ? '2vh' : isCheckout ? '50%' : '100vh',
              scale: isCheckout ? 1.15 : 1,
              x: recoil * 8,
              opacity: view === 'build' ? 1 : isCheckout ? heroOpacity : 0,
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
          <motion.div
            key={location.pathname}
            custom={slideDir}
            initial={
              isSplash || isCheckout
                ? { opacity: 0 }
                : view === 'build'
                  ? { x: `${slideDir * 100}%`, opacity: 0 }
                  : view === 'impact'
                    ? {
                        opacity: 0,
                        x:
                          prevView === 'build' || prevView === 'checkout'
                            ? 0
                            : `${slideDir * 100}%`,
                      }
                    : { x: `${slideDir * 100}%`, opacity: 0 }
            }
            animate={{ x: 0, opacity: 1 }}
            exit={
              isSplash || view === 'build' || isCheckout
                ? { opacity: 0, transition: { duration: DUR.INSTANT } }
                : view === 'impact'
                  ? { x: `${slideDir * -100}%`, opacity: 0 }
                  : { x: `${slideDir * 100}%`, opacity: 0 }
            }
            transition={
              view === 'impact' &&
              (prevView === 'build' || prevView === 'checkout')
                ? { duration: DUR.IMPACT }
                : SPRING.VIEW
            }
            className="absolute inset-0 flex flex-col"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {isCheckout && (
            <CheckoutTransition
              key="checkout-overlay"
              onComplete={handleCheckoutComplete}
              onStateChange={(r, o) => {
                setRecoil(r);
                setHeroOpacity(o);
              }}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isSplash && (
          <SplashScreen key="splash" onStart={() => navigate('/build')} />
        )}
      </AnimatePresence>
    </div>
  );
}

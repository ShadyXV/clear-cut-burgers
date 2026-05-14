import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BurgerStack } from './BurgerStack';

type Phase = 'fade' | 'smash' | 'bites' | 'dissolve' | 'blank';

interface CheckoutTransitionProps {
  burgerState: Record<string, string | null>;
  onComplete: () => void;
}

// Three bite "erasers" — circles of the page background colour positioned over the burger,
// scaling in to look like chunks have been taken out.
const BITES = [
  { cx: '60%', cy: '70%', r: 64, delay: 0   }, // bottom-right (patty area)
  { cx: '38%', cy: '28%', r: 58, delay: 380 }, // top-left (bun)
  { cx: '68%', cy: '46%', r: 72, delay: 760 }, // right side (cheese/toppings)
];

export const CheckoutTransition = ({ burgerState, onComplete }: CheckoutTransitionProps) => {
  const [phase, setPhase] = useState<Phase>('fade');
  const [activeBites, setActiveBites] = useState<number>(0);
  const [recoil, setRecoil] = useState<number>(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const addTimer = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    // Phase A → B at 500ms
    addTimer(() => setPhase('smash'), 500);
    // Phase B → C at 1100ms
    addTimer(() => setPhase('bites'), 1100);
    // Bite 1 at 1100ms (immediate when phase=bites)
    addTimer(() => { setActiveBites(1); setRecoil(1); }, 1100);
    addTimer(() => setRecoil(0), 1280);
    // Bite 2 at 1500ms
    addTimer(() => { setActiveBites(2); setRecoil(2); }, 1500);
    addTimer(() => setRecoil(0), 1680);
    // Bite 3 at 1900ms
    addTimer(() => { setActiveBites(3); setRecoil(3); }, 1900);
    addTimer(() => setRecoil(0), 2080);
    // Phase C → D at 2600ms
    addTimer(() => setPhase('dissolve'), 2600);
    // Phase D → E at 3200ms
    addTimer(() => setPhase('blank'), 3200);
    // Complete at 3700ms
    addTimer(() => onComplete(), 3700);

    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current = [];
    };
  }, [onComplete]);

  // Recoil shake: small x-offset depending on which bite is taking effect
  const recoilOffset = recoil === 1 ? -4 : recoil === 2 ? 4 : recoil === 3 ? -3 : 0;

  // Burger scale + isAssembled per phase
  const burgerScale =
    phase === 'fade'     ? 0.85 :
    phase === 'smash'    ? 1.08 :
    phase === 'bites'    ? 1.08 :
    phase === 'dissolve' ? 0.4  : 0;

  const burgerOpacity =
    phase === 'dissolve' ? 0 :
    phase === 'blank'    ? 0 : 1;

  const isAssembled = phase !== 'fade';

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] items-center justify-center relative overflow-hidden">

      {/* The burger, centered */}
      <AnimatePresence>
        {phase !== 'blank' && (
          <motion.div
            key="burger-wrap"
            className="relative flex items-center justify-center w-[340px] h-[440px]"
            animate={{
              scale: burgerScale,
              x: recoilOffset,
              opacity: burgerOpacity,
            }}
            transition={{
              scale:   { type: 'spring', stiffness: 220, damping: 22 },
              x:       { type: 'spring', stiffness: 600, damping: 14 },
              opacity: { duration: 0.5 },
            }}
          >
            <BurgerStack
              burgerState={burgerState}
              direction={1}
              isAssembled={isAssembled}
              isCompact
            />

            {/* Bite overlays — circles in bg color that "erase" chunks of the burger */}
            {BITES.map((b, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: b.cx,
                  top: b.cy,
                  width: b.r * 2,
                  height: b.r * 2,
                  marginLeft: -b.r,
                  marginTop: -b.r,
                  borderRadius: '50%',
                  background: '#09090b',
                  boxShadow: '0 0 0 3px rgba(9,9,11,1), inset 0 0 8px rgba(0,0,0,0.6)',
                  pointerEvents: 'none',
                  zIndex: 200,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: activeBites > i ? 1 : 0,
                  opacity: activeBites > i ? 1 : 0,
                }}
                transition={{
                  scale:   { type: 'spring', stiffness: 380, damping: 20 },
                  opacity: { duration: 0.18 },
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase E: single thin white line draws across centre */}
      <AnimatePresence>
        {phase === 'blank' && (
          <motion.div
            key="blank-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              scaleX:  { duration: 0.32, ease: 'easeOut' },
              opacity: { duration: 0.5, times: [0, 0.2, 0.7, 1] },
            }}
            style={{ originX: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px w-[60%] bg-white"
          />
        )}
      </AnimatePresence>

      {/* Subtle progress hint at top — only during phases A-B-C */}
      <AnimatePresence>
        {(phase === 'smash' || phase === 'bites' || phase === 'dissolve') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-zinc-700 font-bold"
          >
            Calculating impact…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

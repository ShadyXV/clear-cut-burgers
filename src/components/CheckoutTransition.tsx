import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BurgerStack } from './BurgerStack';
import {
  SPRING,
  EASE,
  DUR,
  CHECKOUT_TIMELINE,
  SIZES,
} from '../constants/animations';

type Phase =
  | 'arriving'
  | 'bites'
  | 'dissolve'
  | 'blank'
  | 'text'
  | 'reassemble';

interface CheckoutTransitionProps {
  burgerState: Record<string, string | null>;
  onComplete: () => void;
}

const BITES = [
  { dx: 160, dy: -60, r: 160, recoil: -1 },
  { dx: 100, dy: 80, r: 155, recoil: 1 },
  { dx: -30, dy: -40, r: 150, recoil: -1 },
  { dx: -140, dy: 40, r: 145, recoil: 1 },
];

const TEXT_LINES: { text: string; className: string }[] = [
  {
    text: "WHAT THE MENU DOESN'T SHOW",
    className:
      'text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600',
  },
  {
    text: 'Animal agriculture occupies 83% of global farmland',
    className: 'text-[22px] font-black leading-snug text-zinc-100 text-center',
  },
  {
    text: "to produce just 18% of the world's calories.",
    className: 'text-[22px] font-black leading-snug text-zinc-400 text-center',
  },
  {
    text: 'The environmental cost never appears on a menu.',
    className: 'text-sm font-medium text-zinc-500 text-center',
  },
  {
    text: 'Until now.',
    className: 'text-sm font-bold text-amber-500 text-center',
  },
];

export const CheckoutTransition = ({
  burgerState,
  onComplete,
}: CheckoutTransitionProps) => {
  const [phase, setPhase] = useState<Phase>('arriving');
  const [isAssembled, setIsAssembled] = useState(false);
  const [activeBites, setActiveBites] = useState(0);
  const [recoil, setRecoil] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    // Named phase handlers — intent is clear at call site
    const startBites = () => setPhase('bites');
    const startDissolve = () => setPhase('dissolve');
    const startBlank = () => setPhase('blank');
    const startText = () => setPhase('text');
    const showBtn = () => setShowButton(true);

    // Start assembling slightly after the hero starts moving down
    t(() => setIsAssembled(true), 250);

    t(startBites, CHECKOUT_TIMELINE.BITES_START);

    BITES.forEach((b, i) => {
      const at =
        CHECKOUT_TIMELINE.BITES_START + CHECKOUT_TIMELINE.BITE_INTERVALS[i];
      t(() => {
        setActiveBites(i + 1);
        setRecoil(b.recoil);
      }, at);
      t(() => setRecoil(0), at + CHECKOUT_TIMELINE.RECOIL_RESET_MS);
    });

    t(startDissolve, CHECKOUT_TIMELINE.DISSOLVE);
    t(startBlank, CHECKOUT_TIMELINE.BLANK);
    t(startText, CHECKOUT_TIMELINE.TEXT_START);

    CHECKOUT_TIMELINE.TEXT_LINE_MS.forEach((ms, i) => {
      t(() => setVisibleLines(i + 1), ms);
    });

    t(showBtn, CHECKOUT_TIMELINE.BUTTON);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [onComplete]);

  const handleSeeImpact = () => {
    setShowButton(false);
    setPhase('reassemble');
    timersRef.current.push(
      window.setTimeout(() => onComplete(), CHECKOUT_TIMELINE.REASSEMBLY_MS),
    );
  };

  const heroVisible =
    phase === 'arriving' || phase === 'bites' || phase === 'dissolve';
  const heroOpacity = phase === 'dissolve' ? 0 : 1;

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: DUR.NAV } }}
      transition={{ duration: DUR.NAV, ease: 'easeIn' }}
      style={{ backgroundColor: '#09090b' }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {/* ── Checkout hero burger ── */}
        <AnimatePresence>
          {heroVisible && (
            <motion.div
              key="hero"
              className={`w-[${SIZES.BURGER_CONTAINER_W}px] h-[${SIZES.BURGER_CONTAINER_H}px] flex items-center justify-center`}
              initial={{ y: '-28vh', scale: 0.85, opacity: 0 }}
              animate={{
                y: 0,
                scale: phase === 'dissolve' ? 1.04 : 1.1,
                opacity: heroOpacity,
                x: recoil * SIZES.RECOIL_PX,
              }}
              transition={{
                y: { ...SPRING.HERO, delay: 0.08 },
                scale: { ...SPRING.HERO, delay: 0.08 },
                opacity: { duration: 0.22, delay: 0.1 },
                x: SPRING.RECOIL,
              }}
            >
              <BurgerStack
                burgerState={burgerState}
                direction={1}
                isAssembled={isAssembled}
                isCompact
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bite circles ── */}
        {BITES.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: b.r * 2,
              height: b.r * 2,
              left: `calc(50% + ${b.dx - b.r}px)`,
              top: `calc(50% + ${b.dy - b.r}px)`,
              background: '#09090b',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: activeBites > i ? 1 : 0,
              opacity: activeBites > i && phase === 'bites' ? 1 : 0,
              x: recoil * SIZES.RECOIL_PX,
            }}
            transition={{
              scale: SPRING.BITE_POP,
              opacity: { duration: phase === 'dissolve' ? 0.55 : 0.06 },
              x: SPRING.RECOIL,
            }}
          />
        ))}

        {/* ── Blank-screen sweep line ── */}
        <AnimatePresence>
          {phase === 'blank' && (
            <motion.div
              key="sweep"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
              transition={{
                scaleX: { duration: 0.32, ease: 'easeOut' },
                opacity: { duration: 0.5, times: [0, 0.2, 0.7, 1] },
              }}
              style={{ originX: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px w-[60%] bg-white"
            />
          )}
        </AnimatePresence>

        {/* ── Calculating label ── */}
        <AnimatePresence>
          {(phase === 'bites' || phase === 'dissolve') && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold select-none"
            >
              Calculating impact…
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── Text reveal ── */}
        <AnimatePresence>
          {phase === 'text' && (
            <motion.div
              key="text-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-10"
            >
              {TEXT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE.SNAPPY }}
                  className={line.className}
                >
                  {line.text}
                </motion.p>
              ))}

              <AnimatePresence>
                {showButton && (
                  <motion.button
                    key="see-impact"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: DUR.IMPACT, ease: EASE.SNAPPY }}
                    onClick={handleSeeImpact}
                    className="mt-4 px-8 py-3.5 bg-amber-500 text-zinc-950 font-black text-sm rounded-full tracking-wide hover:bg-amber-400 active:bg-amber-300 transition-colors"
                  >
                    See the impact →
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Burger reassembly ── */}
        <AnimatePresence>
          {phase === 'reassemble' && (
            <motion.div
              key="reassemble"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className={`w-[${SIZES.BURGER_CONTAINER_W}px] h-[${SIZES.BURGER_CONTAINER_H}px] flex items-center justify-center`}
              >
                <BurgerStack
                  burgerState={burgerState}
                  direction={1}
                  isAssembled={true}
                  isCompact
                  staggerIn
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

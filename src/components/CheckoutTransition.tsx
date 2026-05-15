import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPRING, EASE, DUR, CHECKOUT_TIMELINE } from '../constants/animations';

type Phase =
  | 'arriving'
  | 'bites'
  | 'dissolve'
  | 'blank'
  | 'text'
  | 'reassemble';

interface CheckoutTransitionProps {
  onComplete: () => void;
  onStateChange: (recoil: number, opacity: number) => void;
}

// Fixed coordinates to cover the burger snappily in 4 bites
const BITES = [
  { dx: 100, dy: -40, r: 140, recoil: -1.2 },
  { dx: -80, dy: 20, r: 145, recoil: 1.2 },
  { dx: 40, dy: 60, r: 150, recoil: -1.2 },
  { dx: -40, dy: -70, r: 155, recoil: 1.2 },
];

const TEXT_LINES: { text: string; className: string }[] = [
  {
    text: "WHAT THE MENU DOESN'T SHOW",
    className:
      'text-xs font-black uppercase tracking-[0.25em] text-zinc-600',
  },
  {
    text: 'Animal agriculture occupies 83% of global farmland',
    className: 'text-3xl font-black leading-tight text-zinc-100 text-center px-4',
  },
  {
    text: "to produce just 18% of the world's calories.",
    className: 'text-2xl font-black leading-snug text-zinc-400 text-center px-4',
  },
  {
    text: 'The environmental cost never appears on a menu.',
    className: 'text-lg font-medium text-zinc-500 text-center mt-2 px-4',
  },
];

export const CheckoutTransition = ({
  onComplete,
  onStateChange,
}: CheckoutTransitionProps) => {
  const [phase, setPhase] = useState<Phase>('arriving');
  const [activeBites, setActiveBites] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const timersRef = useRef<number[]>([]);
  const callbacksRef = useRef({ onComplete, onStateChange });

  useEffect(() => {
    callbacksRef.current = { onComplete, onStateChange };
  }, [onComplete, onStateChange]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    const startBites = () => setPhase('bites');
    const startDissolve = () => {
      setPhase('dissolve');
      callbacksRef.current.onStateChange(0, 0); // Completely hide the burger
    };
    const startBlank = () => setPhase('blank');
    const startText = () => setPhase('text');
    const showBtn = () => setShowButton(true);

    t(startBites, CHECKOUT_TIMELINE.BITES_START);

    BITES.forEach((b, i) => {
      const at =
        CHECKOUT_TIMELINE.BITES_START + CHECKOUT_TIMELINE.BITE_INTERVALS[i];
      t(() => {
        setActiveBites(i + 1);
        callbacksRef.current.onStateChange(b.recoil, 1);
        // On the very last bite, fade the burger out
        if (i === BITES.length - 1) {
          t(startDissolve, 250); // Snappy dissolve after last bite
        }
      }, at);
      t(
        () => callbacksRef.current.onStateChange(0, 1),
        at + CHECKOUT_TIMELINE.RECOIL_RESET_MS,
      );
    });

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
  }, []); // Empty dependency array so this effect only runs once on mount

  const handleSeeImpact = () => {
    setShowButton(false);
    setPhase('reassemble');
    timersRef.current.push(
      window.setTimeout(
        () => callbacksRef.current.onComplete(),
        CHECKOUT_TIMELINE.REASSEMBLY_MS,
      ),
    );
  };

  return (
    <motion.div
      className="absolute inset-0 z-[50] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: DUR.NAV } }}
      transition={{ duration: DUR.NAV, ease: 'easeIn' }}
    >
      <div className="w-full h-full flex items-center justify-center relative">
        {/* Background dissolve that sits behind the persistent burger */}
        <motion.div
          className="absolute inset-0 bg-[#09090b] z-0"
          animate={{
            opacity:
              phase === 'dissolve' ||
                phase === 'blank' ||
                phase === 'text' ||
                phase === 'reassemble'
                ? 1
                : 0.4,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* ── Bite circles ── */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="relative w-full h-full">
            {BITES.map((b, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
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
                  opacity:
                    activeBites > i &&
                      (phase === 'bites' ||
                        phase === 'dissolve' ||
                        phase === 'blank')
                      ? 1
                      : 0,
                }}
                transition={{
                  scale: SPRING.BITE_POP,
                  opacity: { duration: 0.1 },
                }}
              />
            ))}
          </div>
        </div>

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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px w-[60%] bg-white z-[60]"
            />
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
              {TEXT_LINES.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: i < visibleLines ? 1 : 0,
                    y: i < visibleLines ? 0 : 16
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={line.className}
                >
                  {line.text}
                </motion.p>
              ))}

              <div className="h-[52px] mt-6">
                <AnimatePresence>
                  {showButton && (
                    <motion.button
                      key="see-impact"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{
                        duration: 0.9,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={handleSeeImpact}
                      className="h-full px-8 bg-amber-500 text-zinc-950 font-black text-sm rounded-full tracking-wide hover:bg-amber-400 active:bg-amber-300 transition-colors"
                    >
                      See the impact →
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

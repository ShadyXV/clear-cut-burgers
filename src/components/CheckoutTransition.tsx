import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BurgerStack } from './BurgerStack';

type Phase = 'arriving' | 'bites' | 'dissolve' | 'blank' | 'text' | 'reassemble';

interface CheckoutTransitionProps {
  burgerState: Record<string, string | null>;
  onComplete: () => void;
}

const BITES = [
  { delay:   0, dx:  160, dy: -60,  r: 160, recoil: -1 },
  { delay: 380, dx:  100, dy:  80,  r: 155, recoil:  1 },
  { delay: 760, dx: -30,  dy: -40,  r: 150, recoil: -1 },
  { delay:1140, dx: -140, dy:  40,  r: 145, recoil:  1 },
];

const TEXT_LINES: { text: string; className: string }[] = [
  {
    text: "WHAT THE MENU DOESN'T SHOW",
    className: "text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600",
  },
  {
    text: "Animal agriculture occupies 83% of global farmland",
    className: "text-[22px] font-black leading-snug text-zinc-100 text-center",
  },
  {
    text: "to produce just 18% of the world's calories.",
    className: "text-[22px] font-black leading-snug text-zinc-400 text-center",
  },
  {
    text: "The environmental cost never appears on a menu.",
    className: "text-sm font-medium text-zinc-500 text-center",
  },
  {
    text: "Until now.",
    className: "text-sm font-bold text-amber-500 text-center",
  },
];

export const CheckoutTransition = ({ burgerState, onComplete }: CheckoutTransitionProps) => {
  const [phase, setPhase]             = useState<Phase>('arriving');
  const [activeBites, setActiveBites] = useState(0);
  const [recoil, setRecoil]           = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton]     = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      timersRef.current.push(window.setTimeout(fn, ms));
    };

    // — checkout hero animation —
    t(() => setPhase('bites'), 650);

    BITES.forEach((b, i) => {
      const at = 650 + b.delay;
      t(() => { setActiveBites(i + 1); setRecoil(b.recoil); }, at);
      t(() => setRecoil(0), at + 200);
    });

    t(() => setPhase('dissolve'), 2200);
    t(() => setPhase('blank'),    2700);

    // — text reveal —
    t(() => setPhase('text'),     3200);
    t(() => setVisibleLines(1),   3350);
    t(() => setVisibleLines(2),   3850);
    t(() => setVisibleLines(3),   4700);
    t(() => setVisibleLines(4),   5400);
    t(() => setVisibleLines(5),   5950);
    t(() => setShowButton(true),  6600);

    return () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  }, [onComplete]);

  const handleSeeImpact = () => {
    setShowButton(false);
    setPhase('reassemble');
    timersRef.current.push(window.setTimeout(() => onComplete(), 1400));
  };

  const heroVisible  = phase === 'arriving' || phase === 'bites' || phase === 'dissolve';
  const heroOpacity  = phase === 'dissolve' ? 0 : 1;

  return (
    <motion.div
      className="absolute inset-0 z-30 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.35, ease: 'easeIn' }}
      style={{ backgroundColor: '#09090b' }}
    >
      <div className="w-full h-full flex items-center justify-center relative">

        {/* ── Checkout hero burger ── */}
        <AnimatePresence>
          {heroVisible && (
            <motion.div
              key="hero"
              className="w-[340px] h-[440px] flex items-center justify-center"
              initial={{ y: '-28vh', scale: 0.85, opacity: 0 }}
              animate={{
                y:       0,
                scale:   phase === 'dissolve' ? 1.04 : 1.1,
                opacity: heroOpacity,
                x:       recoil * 8,
              }}
              transition={{
                y:       { type: 'spring', stiffness: 80, damping: 20, delay: 0.08 },
                scale:   { type: 'spring', stiffness: 80, damping: 20, delay: 0.08 },
                opacity: { duration: 0.22, delay: 0.1 },
                x:       { type: 'spring', stiffness: 600, damping: 14 },
              }}
            >
              <BurgerStack
                burgerState={burgerState}
                direction={1}
                isAssembled={true}
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
              width:      b.r * 2,
              height:     b.r * 2,
              left:       `calc(50% + ${b.dx - b.r}px)`,
              top:        `calc(50% + ${b.dy - b.r}px)`,
              background: '#09090b',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale:   activeBites > i ? 1 : 0,
              opacity: activeBites > i && phase === 'bites' ? 1 : 0,
              x: recoil * 8,
            }}
            transition={{
              scale:   { type: 'spring', stiffness: 320, damping: 18 },
              opacity: { duration: phase === 'dissolve' ? 0.55 : 0.06 },
              x:       { type: 'spring', stiffness: 600, damping: 14 },
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
                scaleX:  { duration: 0.32, ease: 'easeOut' },
                opacity: { duration: 0.5, times: [0, 0.2, 0.7, 1] },
              }}
              style={{ originX: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px w-[60%] bg-white"
            />
          )}
        </AnimatePresence>

        {/* ── Calculating label (bites / dissolve) ── */}
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
                  transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
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
                    transition={{ duration: 0.55, ease: [0.25, 1, 0.5, 1] }}
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
              <div className="w-[340px] h-[440px] flex items-center justify-center">
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

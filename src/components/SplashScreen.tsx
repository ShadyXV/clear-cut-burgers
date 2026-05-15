import { motion } from 'motion/react';
import { EASE, DUR, SPRING } from '../constants/animations';
import { BurgerStack } from './BurgerStack';

interface SplashScreenProps {
  onStart: () => void;
  burgerState: Record<string, string | null>;
}

export const SplashScreen = ({ onStart, burgerState }: SplashScreenProps) => (
  <motion.div
    className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden"
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    exit={{ y: '-100%' }}
    transition={{ duration: DUR.SPLASH, ease: EASE.CURTAIN }}
  >
    {/* Animated Left Burger with Shared Layout ID */}
    <motion.div 
      layoutId="hero-burger"
      className="absolute left-[8%] top-1/2 -translate-y-1/2 scale-75 opacity-80 pointer-events-none"
    >
      <BurgerStack 
        burgerState={burgerState} 
        direction={1} 
        isAssembled={true} 
        isCompact={true} 
      />
    </motion.div>

    {/* Subtle amber radial glow from below centre */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_65%,rgba(245,158,11,0.07),transparent)]" />

    <motion.div 
      className="relative flex flex-col items-center text-center px-10 max-w-xs gap-8"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
      }}
    >
      {/* Brand badge */}
      <motion.div 
        variants={{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 }
        }}
        transition={SPRING.SMOOTH}
        className="flex items-center gap-2.5"
      >
        <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center font-black text-zinc-950 text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          B
        </div>
        <span className="text-[11px] font-bold tracking-[0.22em] text-zinc-500 uppercase">
          Clean Cut Burgers
        </span>
      </motion.div>

      {/* Headline */}
      <motion.div 
        variants={{
          initial: { opacity: 0, scale: 0.9, rotateX: -20 },
          animate: { opacity: 1, scale: 1, rotateX: 0 }
        }}
        transition={SPRING.HERO}
        className="flex flex-col gap-1"
      >
        <p className="text-5xl font-black italic text-zinc-100 leading-none tracking-tight">
          BUILD YOUR
        </p>
        <p className="text-5xl font-black italic text-amber-500 leading-none tracking-tight drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          CLEAN CUT.
        </p>
      </motion.div>

      {/* Subtext */}
      <motion.p 
        variants={{
          initial: { opacity: 0 },
          animate: { opacity: 1 }
        }}
        className="text-sm text-zinc-500 leading-relaxed"
      >
        Pick your bun. Select your protein.
        <br />
        Load up the toppings. Make it yours.
      </motion.p>

      {/* CTA */}
      <motion.div
        variants={{
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 }
        }}
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.04, backgroundColor: '#fbbf24' }}
          whileTap={{ scale: 0.96 }}
          transition={SPRING.BUTTON}
          className="px-9 py-3.5 bg-amber-500 text-zinc-950 font-black text-sm rounded-full tracking-wide transition-colors shadow-[0_8px_30px_rgba(245,158,11,0.25)]"
        >
          BUILD MY BURGER →
        </motion.button>
      </motion.div>
    </motion.div>
  </motion.div>
);

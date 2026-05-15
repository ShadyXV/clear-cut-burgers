import { motion } from 'motion/react';
import { EASE, DUR, SPRING } from '../constants/animations';

export const SplashScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div
    className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ y: '-100%' }}
    transition={{ duration: DUR.SPLASH, ease: EASE.CURTAIN }}
  >
    {/* Subtle amber radial glow from below centre */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_65%,rgba(245,158,11,0.07),transparent)]" />

    <div className="relative flex flex-col items-center text-center px-10 max-w-xs gap-8">
      {/* Brand badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center font-black text-zinc-950 text-xs">
          B
        </div>
        <span className="text-[11px] font-bold tracking-[0.22em] text-zinc-500 uppercase">
          Stack Master Labs
        </span>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-1">
        <p className="text-5xl font-black italic text-zinc-100 leading-none tracking-tight">
          BUILD YOUR
        </p>
        <p className="text-5xl font-black italic text-amber-500 leading-none tracking-tight">
          PERFECT STACK.
        </p>
      </div>

      {/* Subtext */}
      <p className="text-sm text-zinc-500 leading-relaxed">
        Pick your bun. Stack your protein.
        <br />
        Load up the toppings. Make it yours.
      </p>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={SPRING.BUTTON}
        className="px-9 py-3.5 bg-amber-500 text-zinc-950 font-black text-sm rounded-full tracking-wide hover:bg-amber-400 active:bg-amber-300 transition-colors"
      >
        BUILD MY BURGER →
      </motion.button>
    </div>
  </motion.div>
);

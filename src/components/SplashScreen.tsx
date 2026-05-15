import { useMemo } from 'react';
import { motion } from 'motion/react';
import { EASE, DUR, SPRING } from '../constants/animations';
import { IngredientSvg } from './ingredients/IngredientLibrary';

const INGREDIENT_IDS = [
  'brioche', 'sesame', 'paprika', 'beefPatty', 'grilledChicken',
  'crispyChicken', 'blackBeanPatty', 'cheddar', 'emmental',
  'mozzarella', 'tomato', 'redOnion', 'pickles', 'bacon',
  'pineapple', 'jalapeno', 'peppers', 'guacamole'
];

export const SplashScreen = ({ onStart }: { onStart: () => void }) => {
  const floatingAssets = useMemo(() => {
    const count = 14 + Math.floor(Math.random() * 4); // 14-18 items
    return Array.from({ length: count }).map((_, i) => {
      const id = INGREDIENT_IDS[Math.floor(Math.random() * INGREDIENT_IDS.length)];
      const isBun = ['brioche', 'sesame', 'paprika'].includes(id);
      const isTopBun = isBun ? Math.random() > 0.5 : undefined;
      const isBottomBun = isBun && !isTopBun ? true : undefined;
      
      // Avoid the center (approx 25% to 75% on both axes)
      // We pick a side first, then a random pos on that side
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;
      
      if (side === 0) { // Top edge
        x = Math.random() * 100;
        y = Math.random() * 25;
      } else if (side === 1) { // Right edge
        x = 75 + Math.random() * 25;
        y = Math.random() * 100;
      } else if (side === 2) { // Bottom edge
        x = Math.random() * 100;
        y = 75 + Math.random() * 25;
      } else { // Left edge
        x = Math.random() * 25;
        y = Math.random() * 100;
      }

      return {
        id,
        isTopBun,
        isBottomBun,
        x: `${x}%`,
        y: `${y}%`,
        s: 0.6 + Math.random() * 0.35,
        r: Math.random() * 80 - 40,
        d: Math.random() * 4,
        duration: 6 + Math.random() * 4,
      };
    });
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%' }}
      transition={{ duration: DUR.SPLASH, ease: EASE.CURTAIN }}
    >
      {/* Floating Ingredients Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingAssets.map((asset, i) => (
          <motion.div
            key={i}
            className="absolute w-48"
            style={{
              left: asset.x,
              top: asset.y,
              scale: asset.s,
              rotate: asset.r,
              opacity: 0.35,
              filter: asset.s < 0.75 ? 'blur(1.5px)' : 'none',
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [asset.r, asset.r + 15, asset.r],
            }}
            transition={{
              duration: asset.duration,
              repeat: Infinity,
              delay: asset.d,
              ease: "easeInOut",
            }}
          >
            <IngredientSvg
              ingredientId={asset.id}
              isTopBun={asset.isTopBun}
              isBottomBun={asset.isBottomBun}
            />
          </motion.div>
        ))}
      </div>

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
};

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { EASE, DUR, SPRING } from '../constants/animations';
import { IngredientSvg } from './ingredients/IngredientLibrary';
import { BURGER_SLOTS } from '../data/ingredients';

interface SplashScreenProps {
  onStart: () => void;
  burgerState: Record<string, string | null>;
}

export const SplashScreen = ({ onStart, burgerState }: SplashScreenProps) => {
  const scatteredLayers = useMemo(() => {
    // We want to render ingredients in their "stack" order (bottom to top)
    // but scatter them across the screen.
    // BURGER_SLOTS is ordered top to bottom.
    // To have correct z-index, we should either render them bottom-to-top 
    // or just rely on the order in the array if they are siblings.
    // Actually, z-index can be explicitly set.
    
    const activeLayers = BURGER_SLOTS.filter(slot => burgerState[slot.id]);
    
    return activeLayers.map((slot, index) => {
      const ingredientId = burgerState[slot.id]!;
      
      // Avoid the center (approx 25% to 75% on both axes)
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;
      
      if (side === 0) { // Top edge
        x = 10 + Math.random() * 80;
        y = 8 + Math.random() * 12;
      } else if (side === 1) { // Right edge
        x = 82 + Math.random() * 8;
        y = 10 + Math.random() * 80;
      } else if (side === 2) { // Bottom edge
        x = 10 + Math.random() * 80;
        y = 82 + Math.random() * 8;
      } else { // Left edge
        x = 10 + Math.random() * 8;
        y = 10 + Math.random() * 80;
      }

      return {
        id: ingredientId,
        slotId: slot.id,
        isTopBun: slot.isTopBun,
        isBottomBun: slot.isBottomBun,
        x: `${x}%`,
        y: `${y}%`,
        scale: 0.7 + Math.random() * 0.3,
        rotate: Math.random() * 90 - 45,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 4,
        zIndex: 100 - BURGER_SLOTS.findIndex(s => s.id === slot.id), // Higher z-index for layers higher in stack
      };
    });
  }, [burgerState]);

  return (
    <motion.div
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ y: '-100%' }}
      transition={{ duration: DUR.SPLASH, ease: EASE.CURTAIN }}
    >
      {/* Scattered Ingredients Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {scatteredLayers.map((layer, i) => (
          <motion.div
            key={`${layer.slotId}-${i}`}
            className="absolute w-48"
            style={{
              left: layer.x,
              top: layer.y,
              scale: layer.scale,
              rotate: layer.rotate,
              opacity: 0.4,
              zIndex: layer.zIndex,
              filter: layer.scale < 0.8 ? 'blur(1.5px)' : 'none',
            }}
            initial={{ x: '-50%', y: '-50%' }}
            animate={{
              y: ['-50%', '-60%', '-50%'],
              rotate: [layer.rotate, layer.rotate + 15, layer.rotate],
            }}
            transition={{
              duration: layer.duration,
              repeat: Infinity,
              delay: layer.delay,
              ease: "easeInOut",
            }}
          >
            <IngredientSvg
              ingredientId={layer.id}
              isTopBun={layer.isTopBun}
              isBottomBun={layer.isBottomBun}
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
          <p className="text-5xl font-black italic text-amber-500 leading-none tracking-tight drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]">
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

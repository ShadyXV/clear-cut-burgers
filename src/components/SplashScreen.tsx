import { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EASE, DUR, SPRING } from '../constants/animations';
import { IngredientSvg } from './ingredients/IngredientLibrary';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import { useBurgerStore } from '../store/useBurgerStore';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen = ({ onStart }: SplashScreenProps) => {
  const [isAssembling, setIsAssembling] = useState(false);
  const { burgerState } = useBurgerStore();

  // Safely handle the transition with a timer and cleanup
  useEffect(() => {
    if (!isAssembling) return;

    const timer = setTimeout(() => {
      onStart();
    }, 1300);

    return () => clearTimeout(timer);
  }, [isAssembling, onStart]);

  const scatteredLayers = useMemo(() => {
    const activeLayers = BURGER_SLOTS.filter((slot) => burgerState[slot.id]);

    // Calculate total height for vertical centering during assembly
    const totalHeight = activeLayers.reduce((sum, slot) => {
      const ingredient = INGREDIENTS[burgerState[slot.id]!];
      return sum + (ingredient?.thickness || 0);
    }, 0);

    let currentOffset = -totalHeight / 2;

    return activeLayers.map((slot) => {
      const ingredientId = burgerState[slot.id]!;
      const ingredient = INGREDIENTS[ingredientId];
      const thickness = ingredient?.thickness || 0;

      // Scattered position logic
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y;
      if (side === 0) {
        // Top edge
        x = 10 + Math.random() * 80;
        y = 8 + Math.random() * 12;
      } else if (side === 1) {
        // Right edge
        x = 82 + Math.random() * 8;
        y = 10 + Math.random() * 80;
      } else if (side === 2) {
        // Bottom edge
        x = 10 + Math.random() * 80;
        y = 82 + Math.random() * 8;
      } else {
        // Left edge
        x = 10 + Math.random() * 8;
        y = 10 + Math.random() * 80;
      }

      // Calculated center position for assembly (in pixels relative to 50%)
      const assembledYOffset = currentOffset + thickness / 2;
      currentOffset += thickness;

      return {
        id: ingredientId,
        slotId: slot.id,
        isTopBun: slot.isTopBun,
        isBottomBun: slot.isBottomBun,
        x: `${x}%`,
        y: `${y}%`,
        assembledYOffset,
        scale: 0.7 + Math.random() * 0.3,
        rotate: Math.random() * 90 - 45,
        delay: Math.random() * 2,
        duration: 8 + Math.random() * 4,
        zIndex: 100 - BURGER_SLOTS.findIndex((s) => s.id === slot.id),
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
      {/* Scattered/Assembling Ingredients Layer */}
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
            animate={
              isAssembling
                ? {
                    left: '50%',
                    top: `calc(50% + ${layer.assembledYOffset}px)`,
                    rotate: 0,
                    scale: 1.2, // Slightly larger for emphasis in center
                    opacity: 1,
                    filter: 'none',
                    y: '-50%',
                  }
                : {
                    y: ['-50%', '-60%', '-50%'],
                    rotate: [layer.rotate, layer.rotate + 15, layer.rotate],
                  }
            }
            transition={
              isAssembling
                ? {
                    duration: 0.8,
                    ease: EASE.SNAPPY,
                    // Stagger the assembly from bottom to top
                    delay: (scatteredLayers.length - 1 - i) * 0.05,
                  }
                : {
                    duration: layer.duration,
                    repeat: Infinity,
                    delay: layer.delay,
                    ease: 'easeInOut',
                  }
            }
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

      {/* Main Text Content — Fades out when assembling */}
      <motion.div
        className="relative flex flex-col items-center text-center px-10 max-w-xs gap-8"
        initial="initial"
        animate={
          isAssembling
            ? { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }
            : 'animate'
        }
        variants={{
          animate: {
            transition: { staggerChildren: 0.15, delayChildren: 0.3 },
          },
        }}
      >
        {/* Brand badge */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
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
            animate: { opacity: 1, scale: 1, rotateX: 0 },
          }}
          transition={SPRING.HERO}
          className="flex flex-col gap-1"
        >
          <p className="text-5xl font-black italic text-zinc-100 leading-none tracking-tight">
            BUILD YOUR
          </p>
          <p className="text-5xl font-black italic text-amber-500 leading-none tracking-tight drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            OWN BURGER.
          </p>
        </motion.div>

        {/* Subtext */}
        <motion.p
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
          }}
          className="text-sm text-zinc-500 leading-relaxed"
        >
          Pick your bun. Select your protein.
          <br />
          Load up the toppings. Make it yours.
        </motion.p>

        <motion.div
          variants={{
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
          }}
        >
          <motion.button
            onClick={() => setIsAssembling(true)}
            disabled={isAssembling}
            whileHover={
              !isAssembling ? { scale: 1.04, backgroundColor: '#fbbf24' } : {}
            }
            whileTap={!isAssembling ? { scale: 0.96 } : {}}
            transition={SPRING.BUTTON}
            className="px-9 py-3.5 bg-amber-500 text-zinc-950 font-black text-sm rounded-full tracking-wide transition-colors shadow-[0_8px_30px_rgba(245,158,11,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            START →
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

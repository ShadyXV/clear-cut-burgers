import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IngredientSvg } from './ingredients/IngredientLibrary';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';

export const BurgerStack = ({ burgerState, direction, isAssembled = false, isCompact = false }: { burgerState: Record<string, string | null>, direction: number, isAssembled?: boolean, isCompact?: boolean }) => {

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 500 : -500,
      opacity: 0,
      rotate: dir > 0 ? 10 : -10
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotate: 0,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 500 : -500,
      opacity: 0,
      rotate: dir < 0 ? -10 : 10
    })
  };

  return (
    <div className={`relative w-[340px] h-full flex flex-col items-center justify-end overflow-visible transition-all duration-700 ease-in-out ${isCompact ? 'pt-8 pb-6' : 'pt-32 pb-16'} ${isAssembled ? 'gap-y-0' : isCompact ? 'gap-y-[1.2rem]' : 'gap-y-[3.5rem]'}`}>
      <AnimatePresence>
        {BURGER_SLOTS.map((slot, index) => {
          const ingredientId = burgerState[slot.id];
          if (!ingredientId) return null;

          const item = INGREDIENTS[ingredientId];
          if (!item) return null;

          // Z-index MUST be highest for the top items in DOM (index 0 is Top Bun)
          // With 14 slots, max zIndex is 100 - 0 = 100.
          const baseZIndex = 100 - index;

          return (
            <motion.div
              key={slot.id}
              layout="position"
              className="relative w-[320px] flex justify-center items-end flex-shrink-0"
              style={{
                height: item.thickness,
                zIndex: baseZIndex,
              }}
              transition={{
                layout: { type: "spring", bounce: 0.2, duration: 0.6 }
              }}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={ingredientId}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-0 w-full"
                >
                  <IngredientSvg 
                    ingredientId={ingredientId} 
                    isTopBun={slot.isTopBun} 
                    isBottomBun={slot.isBottomBun} 
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IngredientSvg } from './ingredients/IngredientLibrary';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';

export const BurgerStack = ({
  burgerState,
  direction,
  isAssembled = false,
  isCompact = false,
  staggerIn = false,
}: {
  burgerState: Record<string, string | null>
  direction: number
  isAssembled?: boolean
  isCompact?: boolean
  staggerIn?: boolean
}) => {

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

  const visibleSlots = staggerIn
    ? BURGER_SLOTS.filter(slot => burgerState[slot.id] && INGREDIENTS[burgerState[slot.id]!])
    : [];

  return (
    <div className={`relative w-[340px] h-full flex flex-col items-center justify-end overflow-visible transition-all duration-700 ease-in-out ${isCompact ? 'pt-8 pb-6' : 'pt-32 pb-16'} ${isAssembled ? 'gap-y-0' : isCompact ? 'gap-y-[1.2rem]' : 'gap-y-[3.5rem]'}`}>
      <AnimatePresence>
        {BURGER_SLOTS.map((slot, index) => {
          const ingredientId = burgerState[slot.id];
          if (!ingredientId) return null;

          const item = INGREDIENTS[ingredientId];
          if (!item) return null;

          const baseZIndex = 100 - index;

          if (staggerIn) {
            const visibleIndex = visibleSlots.findIndex(s => s.id === slot.id);
            // bottom-to-top: bunBottom (highest visibleIndex) gets delay 0
            const delay = (visibleSlots.length - 1 - visibleIndex) * 0.06;
            return (
              <motion.div
                key={slot.id}
                className="relative w-[320px] flex justify-center items-end flex-shrink-0"
                style={{ height: item.thickness, zIndex: baseZIndex }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              >
                <div className="absolute bottom-0 w-full">
                  <IngredientSvg
                    ingredientId={ingredientId}
                    isTopBun={slot.isTopBun}
                    isBottomBun={slot.isBottomBun}
                  />
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={slot.id}
              layout="position"
              className="relative w-[320px] flex justify-center items-end flex-shrink-0"
              style={{ height: item.thickness, zIndex: baseZIndex }}
              transition={{ layout: { type: "spring", bounce: 0.2, duration: 0.6 } }}
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

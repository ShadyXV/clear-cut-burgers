import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IngredientSvg } from './ingredients/IngredientLibrary';
import { BURGER_SLOTS, INGREDIENTS } from '../data/ingredients';
import { SPRING, EASE } from '../constants/animations';
import { slideVariants } from '../constants/variants';

export const BurgerStack = ({
  burgerState,
  direction,
  isAssembled = false,
  isCompact = false,
  staggerIn = false,
}: {
  burgerState: Record<string, string | null>;
  direction: number;
  isAssembled?: boolean;
  isCompact?: boolean;
  staggerIn?: boolean;
}) => {
  const visibleSlots = staggerIn
    ? BURGER_SLOTS.filter(
        (slot) => burgerState[slot.id] && INGREDIENTS[burgerState[slot.id]!],
      )
    : [];

  return (
    <div
      className={`relative w-[340px] h-[600px] flex flex-col items-center justify-end overflow-visible ${isCompact ? 'pb-0' : 'pb-16'} ${isAssembled ? 'gap-y-0' : isCompact ? 'gap-y-[1.6rem]' : 'gap-y-[3.5rem]'}`}
    >
      {BURGER_SLOTS.map((slot, index) => {
        const ingredientId = burgerState[slot.id];
        if (!ingredientId) return null;

        const item = INGREDIENTS[ingredientId];
        if (!item) return null;

        const baseZIndex = 100 - index;

        const isSauce = item.category === 'sauce';

        if (staggerIn) {
          const visibleIndex = visibleSlots.findIndex((s) => s.id === slot.id);
          // bottom-to-top: bunBottom (highest visibleIndex) gets delay 0
          const delay = (visibleSlots.length - 1 - visibleIndex) * 0.06;
          return (
            <motion.div
              key={slot.id}
              className="relative w-[320px] flex justify-center items-end flex-shrink-0"
              style={{ height: item.thickness, zIndex: baseZIndex }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.45, ease: EASE.SNAPPY }}
            >
              <div
                className={`absolute bottom-0 w-full ${isSauce ? 'translate-y-[20px]' : ''}`}
              >
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
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              layout: { ...SPRING.RESPONSIVE, bounce: 0.2, duration: 0.6 },
            }}
          >
            <AnimatePresence custom={direction}>
              <motion.div
                key={ingredientId}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={SPRING.RESPONSIVE}
                className={`absolute bottom-0 w-full ${isSauce ? 'translate-y-[20px]' : ''}`}
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
    </div>
  );
};

import { EASE } from './animations';

// Reusable fade-up entrance — spread into a motion element's initial/animate/transition props
export const fadeUp = (delay = 0, distance = 14) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE.SNAPPY, delay },
});

// Slide variants for ingredient swap (BurgerStack) — use with custom={direction}
export const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 500 : -500,
    opacity: 0,
    rotate: dir > 0 ? 10 : -10,
  }),
  center: { zIndex: 1, x: 0, opacity: 1, rotate: 0 },
  exit: (dir: number) => ({
    zIndex: 0,
    x: dir < 0 ? 500 : -500,
    opacity: 0,
    rotate: dir < 0 ? -10 : 10,
  }),
};

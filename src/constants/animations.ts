// Spring physics presets — use these instead of raw stiffness/damping numbers
export const SPRING = {
  VIEW: { type: 'spring' as const, stiffness: 260, damping: 28 }, // screen slide-in/out
  SNAPPY: { type: 'spring' as const, stiffness: 380, damping: 32 }, // carousel, pill underline
  SMOOTH: { type: 'spring' as const, stiffness: 200, damping: 25 }, // impact row entrance
  RESPONSIVE: { type: 'spring' as const, stiffness: 300, damping: 30 }, // ingredient swap
  RECOIL: { type: 'spring' as const, stiffness: 600, damping: 14 }, // bite recoil
  HERO: { type: 'spring' as const, stiffness: 80, damping: 20 }, // hero burger entrance
  BITE_POP: { type: 'spring' as const, stiffness: 320, damping: 18 }, // bite circle pop
  FOOTER: { type: 'spring' as const, stiffness: 240, damping: 28 }, // impact footer
  BUTTON: { type: 'spring' as const, stiffness: 400, damping: 20 }, // splash button gesture
} as const;

// Named easing curves
export const EASE = {
  SNAPPY: [0.25, 1, 0.5, 1] as const, // used for nav, editor, text reveal, staggerIn
  CURTAIN: [0.76, 0, 0.24, 1] as const, // splash screen exit (strong ease-in-out)
} as const;

// Durations in seconds
export const DUR = {
  INSTANT: 0.001,
  FAST: 0.14, // tab switch
  NAV: 0.35, // overlay fade, stat pill
  IMPACT: 0.55, // impact screen entrance from builder
  SLIDE: 0.75, // nav bar + editor slide during checkout
  SPLASH: 0.62, // splash exit
} as const;

// Checkout phase timeline — all values in milliseconds
export const CHECKOUT_TIMELINE = {
  BITES_START: 650,
  BITE_INTERVALS: [0, 380, 760, 1140] as const,
  RECOIL_RESET_MS: 200,
  DISSOLVE: 2200,
  BLANK: 2700,
  TEXT_START: 3200,
  TEXT_LINE_MS: [3350, 3850, 4700, 5400, 5950] as const,
  BUTTON: 6600,
  REASSEMBLY_MS: 1400, // delay from button click → onComplete()
} as const;

// Shared layout constants
export const SIZES = {
  BURGER_CONTAINER_W: 340,
  BURGER_CONTAINER_H: 440,
  INGREDIENT_WIDTH: 320,
  RECOIL_PX: 8,
} as const;

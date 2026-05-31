export type StatKey = 'co2' | 'water' | 'land' | 'methane' | 'trees' | 'feed';

export interface ImpactMetric {
  co2: number; // kg CO2e
  water: number; // litres of freshwater withdrawals
  land: number; // m²
  methane: number; // g CH4 estimate
  trees: number; // kg CO2e carbon opportunity cost estimate
  feed: number; // kg feed estimate
}

export const STAT_KEYS: StatKey[] = [
  'co2',
  'water',
  'land',
  'methane',
  'trees',
  'feed',
];

// All values are per app serving. CO2e, land, and freshwater withdrawals are scaled
// from Our World in Data's Poore & Nemecek (2018) per-kg datasets. Methane and feed
// values are simplified proxies so the UI labels them as estimates. The forest
// proxy uses Searchinger et al. (2018) carbon opportunity costs, processed by OWID:
// kg CO2e from native vegetation and soil carbon not restored while land produces food.
// Serving assumptions: bun half 30g, animal patty 150g, cheese 30g, bacon 30g,
// vegetables 20-40g, sauce 15g. Plant patties use a cooked-patty serving, not
// 150g dry pulses. Their land values use dry-crop equivalents and are checked
// against plant-burger LCAs reporting roughly 2.5-3.3 m²-year/kg land use.
// Beef uses "Beef (beef herd)" because this app is illustrating a high-impact
// burger patty. Chicken uses "Poultry Meat"; cheese uses "Cheese"; plant patties
// use pulses, mushrooms, or vegetables as the closest OWID category.
// Methane notes: OWID reports beef herd emissions are 49% methane under GWP100.
// Non-rice plant foods are kept as trace estimates rather than hard zeroes.
export const IMPACT_DATA: Record<string, ImpactMetric> = {
  // Buns (30g wheat per half-bun)
  brioche: {
    co2: 0.07,
    water: 22,
    land: 0.14,
    methane: 0.005,
    trees: 0.06,
    feed: 0,
  },
  sesame: {
    co2: 0.06,
    water: 20,
    land: 0.13,
    methane: 0.004,
    trees: 0.06,
    feed: 0,
  },
  paprika: {
    co2: 0.07,
    water: 21,
    land: 0.14,
    methane: 0.005,
    trees: 0.06,
    feed: 0,
  },
  cheeseTopped: {
    co2: 0.1,
    water: 28,
    land: 0.2,
    methane: 0.02,
    trees: 0.12,
    feed: 0.04,
  },
  chiveSesame: {
    co2: 0.06,
    water: 20,
    land: 0.13,
    methane: 0.004,
    trees: 0.06,
    feed: 0,
  },

  // Proteins (150g serving)
  beefPatty: {
    co2: 14.9,
    water: 218,
    land: 48.9,
    methane: 261,
    trees: 21.6,
    feed: 3.75,
  },
  grilledChicken: {
    co2: 1.48,
    water: 99,
    land: 1.8,
    methane: 0.8,
    trees: 1.61,
    feed: 0.28,
  },
  crispyChicken: {
    co2: 1.68,
    water: 110,
    land: 2.0,
    methane: 1.0,
    trees: 1.72,
    feed: 0.3,
  },
  blackBeanPatty: {
    co2: 0.22,
    water: 18,
    land: 0.47,
    methane: 0.01,
    trees: 0.43,
    feed: 0,
  },
  chickpeaPatty: {
    co2: 0.22,
    water: 18,
    land: 0.47,
    methane: 0.01,
    trees: 0.11,
    feed: 0,
  },
  mushroomPatty: {
    co2: 0.11,
    water: 14,
    land: 0.07,
    methane: 0.004,
    trees: 0.08,
    feed: 0,
  },

  // Cheese (30g per slice)
  cheddar: {
    co2: 0.72,
    water: 168,
    land: 2.63,
    methane: 5.1,
    trees: 1.82,
    feed: 0.36,
  },
  emmental: {
    co2: 0.75,
    water: 172,
    land: 2.72,
    methane: 5.4,
    trees: 1.88,
    feed: 0.38,
  },
  mozzarella: {
    co2: 0.5,
    water: 145,
    land: 2.1,
    methane: 3.6,
    trees: 1.45,
    feed: 0.28,
  },
  pepperCheese: {
    co2: 0.7,
    water: 165,
    land: 2.55,
    methane: 5.0,
    trees: 1.76,
    feed: 0.36,
  },
  // Plant-based cheeses are recipe estimates based on nut, soy, and oil footprints.
  cashewCheese: {
    co2: 0.12,
    water: 45,
    land: 0.35,
    methane: 0.006,
    trees: 0.15,
    feed: 0,
  },
  veganSmoked: {
    co2: 0.1,
    water: 30,
    land: 0.25,
    methane: 0.005,
    trees: 0.12,
    feed: 0,
  },

  // Toppings
  tomato: {
    co2: 0.06,
    water: 11,
    land: 0.02,
    methane: 0.004,
    trees: 0.02,
    feed: 0,
  },
  redOnion: {
    co2: 0.01,
    water: 0.3,
    land: 0.02,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  whiteOnion: {
    co2: 0.01,
    water: 0.3,
    land: 0.02,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  friedOnion: {
    co2: 0.06,
    water: 6,
    land: 0.05,
    methane: 0.003,
    trees: 0.03,
    feed: 0,
  },
  pickles: {
    co2: 0.02,
    water: 1,
    land: 0.01,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  pineapple: {
    co2: 0.03,
    water: 5,
    land: 0.03,
    methane: 0.002,
    trees: 0.03,
    feed: 0,
  },
  guacamole: {
    co2: 0.12,
    water: 42,
    land: 0.18,
    methane: 0.006,
    trees: 0.04,
    feed: 0,
  },
  jalapeno: {
    co2: 0.02,
    water: 3,
    land: 0.01,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  peppers: {
    co2: 0.02,
    water: 3,
    land: 0.02,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  bacon: {
    co2: 0.37,
    water: 54,
    land: 0.52,
    methane: 0.15,
    trees: 0.43,
    feed: 0.21,
  },

  // Sauces (15g)
  sauceMayo: {
    co2: 0.02,
    water: 6,
    land: 0.01,
    methane: 0.001,
    trees: 0.02,
    feed: 0,
  },
  sauceHabanero: {
    co2: 0.02,
    water: 3,
    land: 0.01,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
  saucePiri: {
    co2: 0.02,
    water: 3,
    land: 0.01,
    methane: 0.001,
    trees: 0.01,
    feed: 0,
  },
};

export const STAT_META: Record<
  StatKey,
  { label: string; unit: string; color: string; barBg: string }
> = {
  co2: {
    label: 'CO₂',
    unit: 'kg',
    color: 'text-amber-400',
    barBg: 'bg-amber-500',
  },
  water: {
    label: 'Freshwater',
    unit: 'L',
    color: 'text-sky-400',
    barBg: 'bg-sky-500',
  },
  land: {
    label: 'Land',
    unit: 'm²',
    color: 'text-emerald-400',
    barBg: 'bg-emerald-500',
  },
  methane: {
    label: 'Methane est.',
    unit: 'g CH₄',
    color: 'text-orange-400',
    barBg: 'bg-orange-500',
  },
  trees: {
    label: 'Forest opp.',
    unit: 'kg CO₂e',
    color: 'text-lime-400',
    barBg: 'bg-lime-600',
  },
  feed: {
    label: 'Animal feed',
    unit: 'kg feed',
    color: 'text-yellow-400',
    barBg: 'bg-yellow-500',
  },
};

export const COMPARISON: Record<
  StatKey,
  { template: string; convert: (n: number) => string }
> = {
  co2: {
    template: '≈ driving {v} km in an average car',
    convert: (n) => (n / 0.12).toFixed(0),
  },
  water: {
    template: '≈ {v} 8-minute showers of freshwater withdrawals',
    convert: (n) => (n / 65).toFixed(1),
  },
  land: {
    template: '≈ {v} parking spaces of land',
    convert: (n) => (n / 14.9).toFixed(1),
  },
  methane: {
    template: '≈ {v}g CH₄ — 84× more warming than CO₂ over 20 years',
    convert: (n) => (n < 0.01 ? '<0.01' : n < 1 ? n.toFixed(2) : n.toFixed(0)),
  },
  trees: {
    template: '≈ {v} kg CO₂e of land carbon opportunity cost',
    convert: (n) => (n < 0.01 ? '<0.01' : n < 1 ? n.toFixed(2) : n.toFixed(1)),
  },
  feed: {
    template: '≈ {v} kg of upstream animal feed',
    convert: (n) => n.toFixed(2),
  },
};

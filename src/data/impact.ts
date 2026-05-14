export type StatKey = 'co2' | 'water' | 'land' | 'methane' | 'trees' | 'feed';

export interface ImpactMetric {
  co2: number;     // kg CO2e
  water: number;   // litres
  land: number;    // m²
  methane: number; // g CH4
  trees: number;   // count of mature trees felled (e.g. Amazon-rainforest equivalent)
  feed: number;    // kg of feed crops consumed upstream (soy/grain)
}

// All values per serving. Sources: Poore & Nemecek (2018, Science), FAO, Our World in Data.
// Cheese updated to align with Poore & Nemecek (cheese ≈ 23.9 kgCO2e/kg → 0.72 per 30g).
// Trees per beef = 1.3 ha/ton × ~500 trees/ha = 650 trees/ton → 0.0975 per 150g.
// Feed = feed-conversion-ratio × serving (cattle 25:1, pork 7:1, chicken ~1.85:1, dairy ~12kg feed per kg cheese).
export const IMPACT_DATA: Record<string, ImpactMetric> = {
  // Buns (30g wheat per half-bun)
  brioche:       { co2: 0.09,  water: 42,   land: 0.06,  methane: 0.1,   trees: 0,       feed: 0 },
  sesame:        { co2: 0.09,  water: 42,   land: 0.06,  methane: 0.1,   trees: 0,       feed: 0 },
  paprika:       { co2: 0.10,  water: 44,   land: 0.07,  methane: 0.1,   trees: 0,       feed: 0 },
  cheeseTopped:  { co2: 0.12,  water: 52,   land: 0.09,  methane: 0.5,   trees: 0,       feed: 0.04 },
  chiveSesame:   { co2: 0.09,  water: 43,   land: 0.06,  methane: 0.1,   trees: 0,       feed: 0 },

  // Proteins (150g serving)
  beefPatty:      { co2: 9.00,  water: 2310, land: 48.9,  methane: 176.8, trees: 0.0975,  feed: 3.75 },
  grilledChicken: { co2: 0.90,  water: 645,  land: 1.8,   methane: 1.6,   trees: 0.0001,  feed: 0.28 },
  crispyChicken:  { co2: 1.05,  water: 700,  land: 2.1,   methane: 2.0,   trees: 0.0001,  feed: 0.30 },
  blackBeanPatty: { co2: 0.15,  water: 55,   land: 0.30,  methane: 0,     trees: 0,       feed: 0 },

  // Cheese (30g per slice) — corrected upward per Poore & Nemecek 2018
  cheddar:      { co2: 0.72,  water: 300,  land: 1.05,  methane: 15,    trees: 0,       feed: 0.36 },
  emmental:     { co2: 0.75,  water: 315,  land: 1.10,  methane: 16,    trees: 0,       feed: 0.38 },
  mozzarella:   { co2: 0.50,  water: 260,  land: 0.85,  methane: 10,    trees: 0,       feed: 0.28 },
  pepperCheese: { co2: 0.70,  water: 290,  land: 1.00,  methane: 14,    trees: 0,       feed: 0.36 },

  // Toppings
  tomato:     { co2: 0.04,  water: 13,   land: 0.02,  methane: 0.0,  trees: 0,       feed: 0 },
  redOnion:   { co2: 0.03,  water: 8,    land: 0.02,  methane: 0.0,  trees: 0,       feed: 0 },
  whiteOnion: { co2: 0.03,  water: 8,    land: 0.02,  methane: 0.0,  trees: 0,       feed: 0 },
  friedOnion: { co2: 0.08,  water: 22,   land: 0.04,  methane: 0.0,  trees: 0,       feed: 0 },
  pickles:    { co2: 0.03,  water: 10,   land: 0.01,  methane: 0.0,  trees: 0,       feed: 0 },
  pineapple:  { co2: 0.05,  water: 18,   land: 0.03,  methane: 0.0,  trees: 0,       feed: 0 },
  guacamole:  { co2: 0.10,  water: 57,   land: 0.14,  methane: 0.0,  trees: 0,       feed: 0 },
  jalapeno:   { co2: 0.02,  water: 7,    land: 0.01,  methane: 0.0,  trees: 0,       feed: 0 },
  peppers:    { co2: 0.03,  water: 10,   land: 0.02,  methane: 0.0,  trees: 0,       feed: 0 },
  bacon:      { co2: 0.21,  water: 180,  land: 0.51,  methane: 0.75, trees: 0.0003,  feed: 0.21 },

  // Sauces (15g)
  sauceMayo:     { co2: 0.02,  water: 5,    land: 0.01,  methane: 0.0,  trees: 0, feed: 0 },
  sauceHabanero: { co2: 0.02,  water: 4,    land: 0.01,  methane: 0.0,  trees: 0, feed: 0 },
  saucePiri:     { co2: 0.02,  water: 4,    land: 0.01,  methane: 0.0,  trees: 0, feed: 0 },
};

export const STAT_META: Record<StatKey, { label: string; unit: string; color: string; barBg: string }> = {
  co2:     { label: 'CO₂',     unit: 'kg',     color: 'text-amber-400',   barBg: 'bg-amber-500'   },
  water:   { label: 'Water',   unit: 'L',      color: 'text-sky-400',     barBg: 'bg-sky-500'     },
  land:    { label: 'Land',    unit: 'm²',     color: 'text-emerald-400', barBg: 'bg-emerald-500' },
  methane: { label: 'Methane', unit: 'g CH₄',  color: 'text-orange-400',  barBg: 'bg-orange-500'  },
  trees:   { label: 'Trees',   unit: 'felled', color: 'text-lime-400',    barBg: 'bg-lime-600'    },
  feed:    { label: 'Feed',    unit: 'kg crops', color: 'text-yellow-400', barBg: 'bg-yellow-500' },
};

export const COMPARISON: Record<StatKey, { template: string; convert: (n: number) => string }> = {
  co2:     { template: '≈ driving {v} km in an average car',                            convert: n => (n / 0.12).toFixed(0)  },
  water:   { template: '≈ {v} 8-minute showers',                                        convert: n => (n / 65).toFixed(1)    },
  land:    { template: '≈ {v} parking spaces of land',                                  convert: n => (n / 14.9).toFixed(1)  },
  methane: { template: '≈ {v}g CH₄ — 84× more warming than CO₂ over 20 years',         convert: n => n < 1 ? '<1' : n.toFixed(0) },
  trees:   { template: '≈ {v} mature Amazon trees felled',                              convert: n => n < 0.01 ? '<0.01' : n.toFixed(2) },
  feed:    { template: '≈ {v} kg of soy/grain diverted from human food',                convert: n => n.toFixed(2) },
};

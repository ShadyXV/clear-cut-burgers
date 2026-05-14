export type StatKey = 'co2' | 'water' | 'land' | 'methane';

export interface ImpactMetric {
  co2: number;
  water: number;
  land: number;
  methane: number;
}

export const IMPACT_DATA: Record<string, ImpactMetric> = {
  // Buns (30g wheat per half-bun)
  brioche:       { co2: 0.09,  water: 42,   land: 0.06,  methane: 0.1   },
  sesame:        { co2: 0.09,  water: 42,   land: 0.06,  methane: 0.1   },
  paprika:       { co2: 0.10,  water: 44,   land: 0.07,  methane: 0.1   },
  cheeseTopped:  { co2: 0.12,  water: 52,   land: 0.09,  methane: 0.5   },
  chiveSesame:   { co2: 0.09,  water: 43,   land: 0.06,  methane: 0.1   },

  // Proteins (150g serving)
  beefPatty:      { co2: 9.00,  water: 2310, land: 48.9,  methane: 176.8 },
  grilledChicken: { co2: 0.90,  water: 645,  land: 1.8,   methane: 1.6   },
  crispyChicken:  { co2: 1.05,  water: 700,  land: 2.1,   methane: 2.0   },

  // Cheese (30g per slice)
  cheddar:      { co2: 0.39,  water: 222,  land: 0.81,  methane: 8.4  },
  emmental:     { co2: 0.42,  water: 238,  land: 0.87,  methane: 9.0  },
  mozzarella:   { co2: 0.35,  water: 200,  land: 0.72,  methane: 7.5  },
  pepperCheese: { co2: 0.38,  water: 218,  land: 0.79,  methane: 8.1  },

  // Toppings
  tomato:     { co2: 0.04,  water: 13,   land: 0.02,  methane: 0.0  },
  redOnion:   { co2: 0.03,  water: 8,    land: 0.02,  methane: 0.0  },
  whiteOnion: { co2: 0.03,  water: 8,    land: 0.02,  methane: 0.0  },
  friedOnion: { co2: 0.08,  water: 22,   land: 0.04,  methane: 0.0  },
  pickles:    { co2: 0.03,  water: 10,   land: 0.01,  methane: 0.0  },
  pineapple:  { co2: 0.05,  water: 18,   land: 0.03,  methane: 0.0  },
  guacamole:  { co2: 0.10,  water: 57,   land: 0.14,  methane: 0.0  },
  jalapeno:   { co2: 0.02,  water: 7,    land: 0.01,  methane: 0.0  },
  peppers:    { co2: 0.03,  water: 10,   land: 0.02,  methane: 0.0  },
  bacon:      { co2: 0.21,  water: 180,  land: 0.51,  methane: 0.75 },

  // Sauces (15g)
  sauceMayo:     { co2: 0.02,  water: 5,    land: 0.01,  methane: 0.0  },
  sauceHabanero: { co2: 0.02,  water: 4,    land: 0.01,  methane: 0.0  },
  saucePiri:     { co2: 0.02,  water: 4,    land: 0.01,  methane: 0.0  },
};

export const STAT_META: Record<StatKey, { label: string; unit: string; color: string; barBg: string }> = {
  co2:     { label: 'CO₂',     unit: 'kg',    color: 'text-amber-400',   barBg: 'bg-amber-500'   },
  water:   { label: 'Water',   unit: 'L',     color: 'text-sky-400',     barBg: 'bg-sky-500'     },
  land:    { label: 'Land',    unit: 'm²',    color: 'text-emerald-400', barBg: 'bg-emerald-500' },
  methane: { label: 'Methane', unit: 'g CH₄', color: 'text-orange-400',  barBg: 'bg-orange-500'  },
};

export const COMPARISON: Record<StatKey, { template: string; convert: (n: number) => string }> = {
  co2:     { template: '≈ driving {v} km in an average car',  convert: n => (n / 0.12).toFixed(0)  },
  water:   { template: '≈ {v} 8-minute showers',              convert: n => (n / 65).toFixed(1)    },
  land:    { template: '≈ {v} parking spaces of land',        convert: n => (n / 14.9).toFixed(1)  },
  methane: { template: '≈ {v}g CH₄ released into atmosphere', convert: n => n < 1 ? '<1' : n.toFixed(0) },
};

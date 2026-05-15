export interface Species {
  id: string;
  label: string;
  perYear: number;
  perSec: number;
  ingredientIds: string[];
}

// Focused on the 4 species relevant to the burger's protein options (and bacon).
// Fish removed deliberately — the user wants the visualization tied to ingredient choice.
export const SPECIES: Species[] = [
  {
    id: 'chicken',
    label: 'Chickens',
    perYear: 61_171_973_510,
    perSec: 1940,
    ingredientIds: ['grilledChicken', 'crispyChicken'],
  },
  {
    id: 'ducks',
    label: 'Ducks',
    perYear: 2_887_594_480,
    perSec: 92,
    ingredientIds: [],
  },
  {
    id: 'pigs',
    label: 'Pigs',
    perYear: 1_451_856_889,
    perSec: 46,
    ingredientIds: ['bacon'],
  },
  {
    id: 'cattle',
    label: 'Cattle',
    perYear: 298_799_160,
    perSec: 9.47,
    ingredientIds: ['beefPatty'],
  },
];

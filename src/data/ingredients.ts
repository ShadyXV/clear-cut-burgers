export type Category = 'bun' | 'protein' | 'cheese' | 'topping' | 'sauce';

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  thickness: number;
}

export const INGREDIENTS: Record<string, Ingredient> = {
  // Buns
  brioche: {
    id: 'brioche',
    name: 'Brioche Bun',
    category: 'bun',
    thickness: 30,
  },
  sesame: { id: 'sesame', name: 'Sesame Bun', category: 'bun', thickness: 30 },
  paprika: {
    id: 'paprika',
    name: 'Paprika Bun',
    category: 'bun',
    thickness: 30,
  },
  cheeseTopped: {
    id: 'cheeseTopped',
    name: 'Cheese Topped Bun',
    category: 'bun',
    thickness: 30,
  },
  chiveSesame: {
    id: 'chiveSesame',
    name: 'Chive & Sesame',
    category: 'bun',
    thickness: 30,
  },

  // Proteins
  beefPatty: {
    id: 'beefPatty',
    name: '100% Beef Patty',
    category: 'protein',
    thickness: 16,
  },
  grilledChicken: {
    id: 'grilledChicken',
    name: 'Grilled Chicken',
    category: 'protein',
    thickness: 16,
  },
  crispyChicken: {
    id: 'crispyChicken',
    name: 'Crispy Chicken',
    category: 'protein',
    thickness: 16,
  },
  blackBeanPatty: {
    id: 'blackBeanPatty',
    name: 'Black Bean Patty',
    category: 'protein',
    thickness: 16,
  },
  chickpeaPatty: {
    id: 'chickpeaPatty',
    name: 'Chickpea Patty',
    category: 'protein',
    thickness: 16,
  },
  mushroomPatty: {
    id: 'mushroomPatty',
    name: 'Mushroom Patty',
    category: 'protein',
    thickness: 16,
  },

  // Cheese
  cheddar: { id: 'cheddar', name: 'Cheddar', category: 'cheese', thickness: 5 },
  cashewCheese: {
    id: 'cashewCheese',
    name: 'Cashew Cheese',
    category: 'cheese',
    thickness: 5,
  },
  veganSmoked: {
    id: 'veganSmoked',
    name: 'Vegan Smoked',
    category: 'cheese',
    thickness: 5,
  },
  emmental: {
    id: 'emmental',
    name: 'Emmental',
    category: 'cheese',
    thickness: 5,
  },
  mozzarella: {
    id: 'mozzarella',
    name: 'Mozzarella',
    category: 'cheese',
    thickness: 5,
  },
  pepperCheese: {
    id: 'pepperCheese',
    name: 'Pepper Cheese',
    category: 'cheese',
    thickness: 5,
  },

  // Toppings
  tomato: { id: 'tomato', name: 'Tomato', category: 'topping', thickness: 8 },
  redOnion: {
    id: 'redOnion',
    name: 'Red Onion',
    category: 'topping',
    thickness: 8,
  },
  whiteOnion: {
    id: 'whiteOnion',
    name: 'White Onion',
    category: 'topping',
    thickness: 8,
  },
  friedOnion: {
    id: 'friedOnion',
    name: 'Fried Onions',
    category: 'topping',
    thickness: 8,
  },
  pickles: {
    id: 'pickles',
    name: 'Pickles',
    category: 'topping',
    thickness: 8,
  },
  bacon: { id: 'bacon', name: 'Bacon', category: 'topping', thickness: 8 },
  pineapple: {
    id: 'pineapple',
    name: 'Pineapple',
    category: 'topping',
    thickness: 8,
  },
  guacamole: {
    id: 'guacamole',
    name: 'Guacamole',
    category: 'topping',
    thickness: 8,
  },
  jalapeno: {
    id: 'jalapeno',
    name: 'Jalapeños',
    category: 'topping',
    thickness: 8,
  },
  peppers: {
    id: 'peppers',
    name: 'Sweet Peppers',
    category: 'topping',
    thickness: 8,
  },

  // Sauces
  sauceMayo: {
    id: 'sauceMayo',
    name: 'Pepper Mayo',
    category: 'sauce',
    thickness: 5,
  },
  sauceHabanero: {
    id: 'sauceHabanero',
    name: 'Habanero',
    category: 'sauce',
    thickness: 5,
  },
  saucePiri: {
    id: 'saucePiri',
    name: 'Piri-Piri',
    category: 'sauce',
    thickness: 5,
  },
};

export const CATEGORIES: Record<Category, string[]> = {
  bun: ['brioche', 'sesame', 'paprika', 'cheeseTopped', 'chiveSesame'],
  protein: [
    'beefPatty',
    'grilledChicken',
    'crispyChicken',
    'blackBeanPatty',
    'chickpeaPatty',
    'mushroomPatty',
  ],
  cheese: [
    'cheddar',
    'emmental',
    'mozzarella',
    'pepperCheese',
    'cashewCheese',
    'veganSmoked',
  ],
  topping: [
    'tomato',
    'redOnion',
    'whiteOnion',
    'friedOnion',
    'pickles',
    'bacon',
    'pineapple',
    'guacamole',
    'jalapeno',
    'peppers',
  ],
  sauce: ['sauceMayo', 'sauceHabanero', 'saucePiri'],
};

export type SlotKey =
  | 'bunTop'
  | `topping${1 | 2}`
  | `cheese${1 | 2}`
  | `protein${1 | 2}`
  | `sauceBottom`
  | 'bunBottom';

export const BURGER_SLOTS: {
  id: SlotKey;
  label: string;
  category: Category | 'bun';
  isTopBun?: boolean;
  isBottomBun?: boolean;
}[] = [
  { id: 'bunTop', label: 'Top Bun', category: 'bun', isTopBun: true },
  { id: 'topping2', label: 'Topping 2', category: 'topping' },
  { id: 'topping1', label: 'Topping 1', category: 'topping' },
  { id: 'cheese2', label: 'Extra Cheese', category: 'cheese' },
  { id: 'cheese1', label: 'Cheese', category: 'cheese' },
  { id: 'protein2', label: 'Patty 2', category: 'protein' },
  { id: 'protein1', label: 'Patty 1', category: 'protein' },
  { id: 'sauceBottom', label: 'Bottom Sauce', category: 'sauce' },
  { id: 'bunBottom', label: 'Bottom Bun', category: 'bun', isBottomBun: true },
];

export const generateRandomBurgerState = (): Record<string, string | null> => {
  const getRandom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const bun = getRandom(CATEGORIES.bun);
  // Exclude vegan patties for the initial "meat" impact
  const proteins = CATEGORIES.protein.filter(
    (id) =>
      id !== 'blackBeanPatty' &&
      id !== 'chickpeaPatty' &&
      id !== 'mushroomPatty',
  );
  const protein = getRandom(proteins);

  return {
    bunTop: bun,
    topping2: getRandom(CATEGORIES.topping),
    topping1: getRandom(CATEGORIES.topping),
    cheese2: null,
    cheese1: getRandom(CATEGORIES.cheese),
    protein2: protein,
    protein1: protein,
    sauceBottom: getRandom(CATEGORIES.sauce),
    bunBottom: bun,
  };
};

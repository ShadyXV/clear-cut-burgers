export const ANIMAL_PROTEINS = new Set([
  'beefPatty',
  'grilledChicken',
  'crispyChicken',
]);
export const ANIMAL_CHEESES = new Set([
  'cheddar',
  'emmental',
  'mozzarella',
  'pepperCheese',
]);

export function isVeganBurger(state: Record<string, string | null>): boolean {
  const proteinSlots = ['protein1', 'protein2', 'protein3'];
  const hasAnyProtein = proteinSlots.some((s) => state[s]);
  const hasAnimalProtein = proteinSlots.some(
    (s) => state[s] && ANIMAL_PROTEINS.has(state[s]!),
  );
  const hasBacon = Object.values(state).includes('bacon');
  const hasDairyCheese = ['cheese1', 'cheese2'].some(
    (s) => state[s] && ANIMAL_CHEESES.has(state[s]!),
  );
  return hasAnyProtein && !hasAnimalProtein && !hasBacon && !hasDairyCheese;
}

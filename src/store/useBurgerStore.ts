import { create } from 'zustand';
import { generateRandomBurgerState, SlotKey } from '../data/ingredients';

interface BurgerState {
  burgerState: Record<string, string | null>;
  direction: number;
  isAssembled: boolean;
  recoil: number;
  heroOpacity: number;

  setSlot: (slotId: SlotKey, val: string | null, dir: number) => void;
  setIsAssembled: (val: boolean) => void;
  setRecoil: (val: number | ((prev: number) => number)) => void;
  setHeroOpacity: (val: number) => void;
  resetForBuilder: () => void;
  switchToPlantBased: () => void;
}

export const useBurgerStore = create<BurgerState>((set) => ({
  burgerState: generateRandomBurgerState(),
  direction: 1,
  isAssembled: false,
  recoil: 0,
  heroOpacity: 1,

  setSlot: (slotId, val, dir) =>
    set((state) => ({
      direction: dir,
      burgerState: { ...state.burgerState, [slotId]: val },
    })),

  setIsAssembled: (val) => set({ isAssembled: val }),

  setRecoil: (val) =>
    set((state) => ({
      recoil: typeof val === 'function' ? val(state.recoil) : val,
    })),

  setHeroOpacity: (val) => set({ heroOpacity: val }),

  resetForBuilder: () =>
    set({
      isAssembled: false,
      recoil: 0,
      heroOpacity: 1,
    }),

  switchToPlantBased: () =>
    set((state) => ({
      burgerState: {
        ...state.burgerState,
        protein1: 'blackBeanPatty',
        protein2: null,
        protein3: null,
        cheese1: null,
        cheese2: null,
        topping1:
          state.burgerState.topping1 === 'bacon'
            ? null
            : state.burgerState.topping1,
        topping2:
          state.burgerState.topping2 === 'bacon'
            ? null
            : state.burgerState.topping2,
        topping3:
          state.burgerState.topping3 === 'bacon'
            ? null
            : state.burgerState.topping3,
        topping4:
          state.burgerState.topping4 === 'bacon'
            ? null
            : state.burgerState.topping4,
        topping5:
          state.burgerState.topping5 === 'bacon'
            ? null
            : state.burgerState.topping5,
        topping6:
          state.burgerState.topping6 === 'bacon'
            ? null
            : state.burgerState.topping6,
      },
      isAssembled: false,
      recoil: 0,
      heroOpacity: 1,
      direction: 1,
    })),
}));

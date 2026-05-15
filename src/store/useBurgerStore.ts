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
}));

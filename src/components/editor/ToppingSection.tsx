import { CATEGORIES, INGREDIENTS, SlotKey } from '../../data/ingredients';
import { SwipeCarousel } from '../SwipeCarousel';
import { SectionWrap, AddButton, SlotDropdown } from './primitives';
import { EditorProps } from './types';

const TOPPING_SLOTS: SlotKey[] = [
  'topping1',
  'topping2',
  'topping3',
  'topping4',
  'topping5',
  'topping6',
];

export const ToppingSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const filledCount = TOPPING_SLOTS.filter((s) => burgerState[s]).length;

  const addTopping = () => {
    const next = TOPPING_SLOTS.find((s) => !burgerState[s]);
    if (next) onChangeSlot(next, CATEGORIES.topping[0], 1);
  };

  // Cascade-remove: when removing slot N, shift N+1..6 down by one
  const removeTopping = (slotId: SlotKey) => {
    const fromIdx = TOPPING_SLOTS.indexOf(slotId);
    for (let i = fromIdx; i < TOPPING_SLOTS.length; i++) {
      const next = TOPPING_SLOTS[i + 1];
      onChangeSlot(TOPPING_SLOTS[i], next ? burgerState[next] : null, 1);
    }
  };

  return (
    <SectionWrap hint="Swipe to choose a topping">
      <SwipeCarousel
        options={[null, ...CATEGORIES.topping]}
        value={burgerState.topping1}
        onChange={(v, d) => {
          if (v === null && burgerState.topping2) removeTopping('topping1');
          else onChangeSlot('topping1', v, d);
        }}
      />
      <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
        {burgerState.topping1
          ? INGREDIENTS[burgerState.topping1]?.name
          : 'No Topping'}
      </p>

      <div className="space-y-2 shrink-0">
        {TOPPING_SLOTS.slice(1).map((slotId) => {
          if (!burgerState[slotId]) return null;
          const num = slotId.replace('topping', '');
          return (
            <SlotDropdown
              key={slotId}
              label={`Topping ${num}`}
              options={CATEGORIES.topping}
              value={burgerState[slotId]}
              onRemove={() => removeTopping(slotId)}
              onChange={(v) => onChangeSlot(slotId, v, 1)}
            />
          );
        })}
        {burgerState.topping1 && filledCount < 6 && (
          <AddButton onClick={addTopping}>Add a Topping</AddButton>
        )}
      </div>
    </SectionWrap>
  );
};

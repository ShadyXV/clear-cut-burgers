import { CATEGORIES, INGREDIENTS } from '../../data/ingredients';
import { SwipeCarousel } from '../SwipeCarousel';
import { SectionWrap, AddButton, SlotDropdown } from './primitives';
import { EditorProps } from './types';

export const CheeseSection = ({ burgerState, onChangeSlot }: EditorProps) => (
  <SectionWrap hint="Add cheese to your burger">
    <SwipeCarousel
      options={[null, ...CATEGORIES.cheese]}
      value={burgerState.cheese1}
      onChange={(v, d) => onChangeSlot('cheese1', v, d)}
    />
    <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
      {burgerState.cheese1
        ? INGREDIENTS[burgerState.cheese1]?.name
        : 'No Cheese'}
    </p>

    {burgerState.cheese1 &&
      (burgerState.cheese2 ? (
        <SlotDropdown
          label="Extra"
          options={CATEGORIES.cheese}
          value={burgerState.cheese2}
          onRemove={() => onChangeSlot('cheese2', null, 1)}
          onChange={(v) => onChangeSlot('cheese2', v, 1)}
        />
      ) : (
        <AddButton
          onClick={() => onChangeSlot('cheese2', CATEGORIES.cheese[0], 1)}
        >
          Add Another Cheese
        </AddButton>
      ))}
  </SectionWrap>
);

import { CATEGORIES, INGREDIENTS } from '../../data/ingredients';
import { SwipeCarousel } from '../SwipeCarousel';
import { SectionWrap, AddButton, SlotDropdown } from './primitives';
import { EditorProps } from './types';

export const ProteinSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const addSecond = () => onChangeSlot('protein2', CATEGORIES.protein[0], 1);

  return (
    <SectionWrap hint="Swipe to choose your protein">
      <SwipeCarousel
        options={CATEGORIES.protein}
        value={burgerState.protein1}
        onChange={(v, d) =>
          onChangeSlot('protein1', v ?? CATEGORIES.protein[0], d)
        }
      />
      <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
        {burgerState.protein1 ? INGREDIENTS[burgerState.protein1]?.name : ''}
      </p>

      {burgerState.protein1 && (
        <>
          {burgerState.protein2 ? (
            <SlotDropdown
              label="2nd Patty"
              options={CATEGORIES.protein}
              value={burgerState.protein2}
              onRemove={() => {
                onChangeSlot('protein2', null, 1);
              }}
              onChange={(v) => onChangeSlot('protein2', v, 1)}
            />
          ) : (
            <AddButton onClick={addSecond}>Add a 2nd Patty</AddButton>
          )}
        </>
      )}
    </SectionWrap>
  );
};

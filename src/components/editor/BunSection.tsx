import { CATEGORIES, INGREDIENTS } from '../../data/ingredients';
import { SwipeCarousel } from '../SwipeCarousel';
import { SectionWrap } from './primitives';
import { EditorProps } from './types';

export const BunSection = ({ burgerState, onChangeSlot }: EditorProps) => {
  const handleChange = (val: string | null, dir: number) => {
    if (!val) return;
    onChangeSlot('bunTop', val, dir);
    onChangeSlot('bunBottom', val, dir);
  };
  const currentName = burgerState.bunTop
    ? INGREDIENTS[burgerState.bunTop]?.name
    : '—';

  return (
    <SectionWrap hint="Swipe to select your bun">
      <SwipeCarousel
        options={CATEGORIES.bun}
        value={burgerState.bunTop}
        onChange={handleChange}
        showTopBun
      />
      <p className="text-center font-bold text-base text-zinc-100 shrink-0">
        {currentName}
      </p>
    </SectionWrap>
  );
};

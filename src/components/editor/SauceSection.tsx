import { CATEGORIES, INGREDIENTS } from '../../data/ingredients';
import { SwipeCarousel } from '../SwipeCarousel';
import { SectionWrap } from './primitives';
import { EditorProps } from './types';

export const SauceSection = ({ burgerState, onChangeSlot }: EditorProps) => (
  <SectionWrap hint="Choose your sauce">
    <SwipeCarousel
      options={[null, ...CATEGORIES.sauce]}
      value={burgerState.sauceBottom}
      onChange={(v, d) => onChangeSlot('sauceBottom', v, d)}
    />
    <p className="text-center text-sm font-bold text-zinc-200 shrink-0">
      {burgerState.sauceBottom
        ? INGREDIENTS[burgerState.sauceBottom]?.name
        : 'No Sauce'}
    </p>
  </SectionWrap>
);

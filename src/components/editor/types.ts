import { SlotKey } from '../../data/ingredients';

export interface EditorProps {
  burgerState: Record<string, string | null>;
  onChangeSlot: (
    slotId: SlotKey,
    val: string | null,
    direction: number,
  ) => void;
}

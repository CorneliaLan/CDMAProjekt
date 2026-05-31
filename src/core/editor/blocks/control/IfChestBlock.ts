import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';
import { BaseIfBlock } from './BaseIfBlock';

export type ChestCondition = 'chestUp' | 'chestDown' | 'chestLeft' | 'chestRight' | 'custom'

export const CHEST_CONDITION_OPTIONS: { value: ChestCondition; label: string }[] = [
  { value: 'chestUp',    label: 'Chest Above' },
  { value: 'chestDown',  label: 'Chest Below' },
  { value: 'chestLeft',  label: 'Chest Left' },
  { value: 'chestRight', label: 'Chest Right' },
  { value: 'custom',     label: 'Custom direction' },
]

export class IfChestBlock extends BaseIfBlock {
  readonly id = 'if-chest';
  readonly label = 'If Chest';
  readonly category = BlockCategory.CONTROL;
  public condition: ChestCondition = 'chestUp';

  protected evaluateCondition(context: ExecutionContext): boolean {
    switch (this.condition) {
      case 'chestUp':    return context.isChestAt(0, -1);
      case 'chestDown':  return context.isChestAt(0, 1);
      case 'chestLeft':  return context.isChestAt(-1, 0);
      case 'chestRight': return context.isChestAt(1, 0);
      case 'custom':     return context.isChestAt(this.customDx, this.customDy);
      default:           return context.isChestAt(0, -1);
    }
  }
}

import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';
import { BaseIfBlock } from './BaseIfBlock';

export type WallCondition = 'wallUp' | 'wallDown' | 'wallLeft' | 'wallRight'

export const WALL_CONDITION_OPTIONS: { value: WallCondition; label: string }[] = [
  { value: 'wallUp',    label: 'Wall Above' },
  { value: 'wallDown',  label: 'Wall Below' },
  { value: 'wallLeft',  label: 'Wall Left' },
  { value: 'wallRight', label: 'Wall Right' },
]

export class IfWallBlock extends BaseIfBlock {
  readonly id = 'if-wall';
  readonly label = 'If Wall';
  readonly category = BlockCategory.CONTROL;
  public condition: WallCondition = 'wallUp';

  protected evaluateCondition(context: ExecutionContext): boolean {
    switch (this.condition) {
      case 'wallUp':    return context.isWallAt(0, -1);
      case 'wallDown':  return context.isWallAt(0, 1);
      case 'wallLeft':  return context.isWallAt(-1, 0);
      case 'wallRight': return context.isWallAt(1, 0);
      default:          return context.isWallAt(0, -1);
    }
  }
}

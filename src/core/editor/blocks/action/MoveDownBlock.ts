import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveDownBlock extends BaseBlock {
  readonly id = 'move-down';
  readonly label = 'Move Down';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    context.movePlayer(0, 1);
  }
}

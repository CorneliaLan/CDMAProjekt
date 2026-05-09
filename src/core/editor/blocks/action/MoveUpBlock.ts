import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveUpBlock extends BaseBlock {
  readonly id = 'move-up';
  readonly label = 'Move Up';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    context.movePlayer(0, -1);
  }
}

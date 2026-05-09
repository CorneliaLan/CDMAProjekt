import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveLeftBlock extends BaseBlock {
  readonly id = 'move-left';
  readonly label = 'Move Left';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    context.movePlayer(-1, 0);
  }
}

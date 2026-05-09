import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveRightBlock extends BaseBlock {
  readonly id = 'move-right';
  readonly label = 'Move Right';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    context.movePlayer(1, 0);
  }
}

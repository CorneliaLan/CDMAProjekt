import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveRightBlock extends BaseBlock {
  readonly id = 'move-right';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    if (!context.isWallAt(1, 0)) {
      context.state.playerX += 1;
    }
  }
}

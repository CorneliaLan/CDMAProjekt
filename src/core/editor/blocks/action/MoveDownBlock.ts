import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class MoveDownBlock extends BaseBlock {
  readonly id = 'move-down';
  readonly category = BlockCategory.ACTION;

  execute(context: ExecutionContext): void {
    if (!context.isWallAt(0, 1)) {
      context.state.playerY += 1;
    }
  }
}

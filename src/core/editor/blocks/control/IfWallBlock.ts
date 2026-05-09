import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class IfWallBlock extends BaseBlock {
  readonly id = 'if-wall';
  readonly label = 'If';
  readonly category = BlockCategory.CONTROL;

  execute(context: ExecutionContext): void {
    if (context.shouldStopExecution() || !context.isWallAhead()) {
      return;
    }

    for (const child of this.children) {
      if (context.shouldStopExecution()) {
        break;
      }

      child.execute(context);
    }
  }
}

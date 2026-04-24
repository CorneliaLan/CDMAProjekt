import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class IfWallBlock extends BaseBlock {
  readonly id = 'if-wall';
  readonly category = BlockCategory.CONTROL;

  execute(context: ExecutionContext): void {
    if (!context.isWallAhead()) {
      return;
    }

    for (const child of this.children) {
      child.execute(context);
    }
  }
}

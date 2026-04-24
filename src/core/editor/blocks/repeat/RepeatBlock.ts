import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class RepeatBlock extends BaseBlock {
  readonly id = 'repeat-x';
  readonly category = BlockCategory.REPEAT;
  public iterations: number = 3;

  execute(context: ExecutionContext): void {
    for (let i = 0; i < this.iterations; i += 1) {
      for (const child of this.children) {
        child.execute(context);
      }
    }
  }
}

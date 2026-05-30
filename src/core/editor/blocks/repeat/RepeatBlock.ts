import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class RepeatBlock extends BaseBlock {
  readonly id = 'repeat-x';
  readonly label = 'Repeat';
  readonly category = BlockCategory.REPEAT;
  public iterations: number = 3;

  constructor(iterations = 3) {
    super();
    this.iterations = Number.isInteger(iterations) && iterations > 0 ? iterations : 3;
  }

  execute(context: ExecutionContext): void {
    for (let i = 0; i < this.iterations; i += 1) {
      if (context.shouldStopExecution()) {
        break;
      }

      for (const child of this.children) {
        if (context.shouldStopExecution()) {
          break;
        }

        child.execute(context);
      }
    }
  }
}

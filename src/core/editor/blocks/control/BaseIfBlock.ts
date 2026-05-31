import { BaseBlock } from '../../BaseBlock';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

/**
 * Shared base for all conditional (if) blocks.
 * Subclasses define which conditions are available via evaluateCondition.
 */
export abstract class BaseIfBlock extends BaseBlock {
  public condition: string = '';
  public trueChildren: BaseBlock[] = [];
  public elseChildren: BaseBlock[] = [];

  execute(context: ExecutionContext): void {
    if (context.shouldStopExecution()) return;

    const branch = this.evaluateCondition(context) ? this.trueChildren : this.elseChildren;

    for (const child of branch) {
      if (context.shouldStopExecution()) break;
      child.execute(context);
    }
  }

  protected abstract evaluateCondition(context: ExecutionContext): boolean;
}

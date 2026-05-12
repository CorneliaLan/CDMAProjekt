import { BaseBlock } from '../../BaseBlock';
import { BlockCategory } from '../../BlockCategories';
import { ExecutionContext } from '@/core/engine/ExecutionContext';

export class IfWallBlock extends BaseBlock {
  readonly id = 'if-wall';
  readonly label = 'If';
  readonly category = BlockCategory.CONTROL;
  public condition: string = 'wallAhead';
  public trueChildren: BaseBlock[] = [];
  public elseChildren: BaseBlock[] = [];

  execute(context: ExecutionContext): void {
    if (!this.evaluateCondition(context)) {
      for (const child of this.elseChildren) {
        child.execute(context);
      }
      return;
    }

    for (const child of [...this.children, ...this.trueChildren]) {
      child.execute(context);
    }
  }

  private evaluateCondition(context: ExecutionContext): boolean {
    switch (this.condition.trim().toLowerCase()) {
      case 'chestahead':
        return context.isChestAhead();
      case 'targetreached':
        return context.isTargetReached();
      case 'wallahead':
      default:
        return context.isWallAhead();
    }
  }
}

import { BlockRegistry } from '../editor/BlockRegistry';
import { MoveDownBlock } from '../editor/blocks/action/MoveDownBlock';
import { MoveLeftBlock } from '../editor/blocks/action/MoveLeftBlock';
import { MoveRightBlock } from '../editor/blocks/action/MoveRightBlock';
import { MoveUpBlock } from '../editor/blocks/action/MoveUpBlock';
import { IfWallBlock } from '../editor/blocks/control/IfWallBlock';
import { RepeatBlock } from '../editor/blocks/repeat/RepeatBlock';

/**
 * Registers default Editor blocks once during app startup.
 */
export function registerDefaultBlocks(): void {
  const registry = BlockRegistry.getInstance();
  registry.register(new MoveDownBlock());
  registry.register(new MoveLeftBlock());
  registry.register(new MoveRightBlock());
  registry.register(new MoveUpBlock());
  registry.register(new IfWallBlock());
  registry.register(new RepeatBlock());
}

import { BlockRegistry, type BlockFactory } from '../editor/BlockRegistry';
import { MoveDownBlock } from '../editor/blocks/action/MoveDownBlock';
import { MoveLeftBlock } from '../editor/blocks/action/MoveLeftBlock';
import { MoveRightBlock } from '../editor/blocks/action/MoveRightBlock';
import { MoveUpBlock } from '../editor/blocks/action/MoveUpBlock';
import { IfWallBlock } from '../editor/blocks/control/IfWallBlock';
import { IfChestBlock } from '../editor/blocks/control/IfChestBlock';
import { RepeatBlock } from '../editor/blocks/repeat/RepeatBlock';
//import { LevelEndBlock } from '../editor/blocks/event/LevelEndBlock';

/**
 * Complete catalog of known block factories.
 */
const BLOCK_FACTORY_CATALOG: Record<string, BlockFactory> = {
  'move-down': () => new MoveDownBlock(),
  'move-left': () => new MoveLeftBlock(),
  'move-right': () => new MoveRightBlock(),
  'move-up': () => new MoveUpBlock(),
  'if-wall': () => new IfWallBlock(),
  'if-chest': () => new IfChestBlock(),
  'repeat-x': () => new RepeatBlock(),
  //'level-end': () => new LevelEndBlock()
};

/**
 * Registers a level-specific block set into the runtime registry.
 */
export function registerBlocksByIds(blockIds: string[]): void {
  const registry = BlockRegistry.getInstance();
  const factories: BlockFactory[] = [];

  for (const blockId of blockIds) {
    const factory = BLOCK_FACTORY_CATALOG[blockId];
    if (!factory) {
      console.warn(`Unknown block id "${blockId}" cannot be registered.`);
      continue;
    }
    factories.push(factory);
  }

  registry.clear();
  registry.registerMany(factories);
}

export function getBlockCatalogIds(): string[] {
  return Object.keys(BLOCK_FACTORY_CATALOG);
}

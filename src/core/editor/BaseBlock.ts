import { BlockCategory } from './BlockCategories';
import { ExecutionContext } from '../engine/ExecutionContext';

/**
 * Base type for all Editor blocks executed by the GameEngine.
 */
export abstract class BaseBlock {
  abstract readonly id: string;
  abstract readonly category: BlockCategory;

  // Child blocks are used by control-flow blocks like repeat/if blocks.
  public children: BaseBlock[] = [];

  abstract execute(context: ExecutionContext): void;
}

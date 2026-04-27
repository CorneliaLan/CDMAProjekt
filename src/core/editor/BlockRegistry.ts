import { BaseBlock } from './BaseBlock';

/**
 * Registry for block definitions available in the Editor.
 */
export class BlockRegistry {
  private static instance: BlockRegistry;
  private readonly blocks: Map<string, BaseBlock> = new Map();

  private constructor() {}

  public static getInstance(): BlockRegistry {
    if (!BlockRegistry.instance) {
      BlockRegistry.instance = new BlockRegistry();
    }
    return BlockRegistry.instance;
  }

  public register(block: BaseBlock): void {
    if (this.blocks.has(block.id)) {
      console.warn(`Block with id ${block.id} is already registered.`);
      return;
    }
    this.blocks.set(block.id, block);
  }

  public getBlock(id: string): BaseBlock | undefined {
    return this.blocks.get(id);
  }

  public getAllBlocks(): BaseBlock[] {
    return Array.from(this.blocks.values());
  }
}

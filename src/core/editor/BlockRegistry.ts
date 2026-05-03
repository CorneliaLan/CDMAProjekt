import { BaseBlock } from './BaseBlock';

export type BlockFactory = () => BaseBlock;

/**
 * Registry for block definitions available in the Editor.
 */
export class BlockRegistry {
  private static instance: BlockRegistry;
  private readonly factories: Map<string, BlockFactory> = new Map();

  private constructor() {}

  public static getInstance(): BlockRegistry {
    if (!BlockRegistry.instance) {
      BlockRegistry.instance = new BlockRegistry();
    }
    return BlockRegistry.instance;
  }

  public register(factory: BlockFactory): void {
    const probe = factory();
    if (this.factories.has(probe.id)) {
      console.warn(`Block with id ${probe.id} is already registered.`);
      return;
    }
    this.factories.set(probe.id, factory);
  }

  public getBlock(id: string): BaseBlock | undefined {
    return this.factories.get(id)?.();
  }

  public getAllBlocks(): BaseBlock[] {
    return Array.from(this.factories.values()).map((f) => f());
  }

  public registerMany(factories: BlockFactory[]): void {
    for (const factory of factories) {
      this.register(factory);
    }
  }

  public clear(): void {
    this.factories.clear();
  }
}

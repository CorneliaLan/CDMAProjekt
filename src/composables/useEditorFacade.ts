import { computed, ref, shallowRef, unref, watch, type MaybeRef } from 'vue';
import { GameEngine } from '@/core/engine/GameEngine';
import { BlockRegistry } from '@/core/editor/BlockRegistry';
import { GameState } from '@/core/engine/GameState';
import type { ExecutionResult } from '@/core/engine/ExecutionResult';
import type { BaseBlock } from '@/core/editor/BaseBlock';
import { BlockCategory } from '@/core/editor/BlockCategories';
import { getLevelById, type LevelDefinition } from '@/core/levels/levelCatalog';
import { registerBlocksByIds } from '@/core/setup/registerDefaultBlocks';
import { RepeatBlock } from '@/core/editor/blocks/repeat/RepeatBlock';
import { BaseIfBlock } from '@/core/editor/blocks/control/BaseIfBlock';

const registry = BlockRegistry.getInstance();

type AvailableBlock = {
  id: string
  label: string
  category: BlockCategory
}

export type ProgramNode = {
  blockId: string
  repeatCount?: number
  children?: ProgramNode[]
  condition?: string
  customDx?: number
  customDy?: number
  trueChildren?: ProgramNode[]
  elseChildren?: ProgramNode[]
}

function createEngine(level: LevelDefinition): GameEngine {
  return new GameEngine(new GameState(level.grid, level.startX, level.startY));
}

export function useEditorFacade(levelId: MaybeRef<number>) {
  const engine = shallowRef<GameEngine | null>(null);
  const gameState = ref<GameState | null>(null);
  const executionResult = ref<ExecutionResult | null>(null);
  const availableBlocks = ref<AvailableBlock[]>([]);
  //const ALWAYS_AVAILABLE_BLOCK_IDS = ['level-end'];
  const programBlocks = ref<BaseBlock[]>([]);

  const level = computed(() => getLevelById(Number(unref(levelId))) ?? null);
  const program = computed(() => [...programBlocks.value]);

  const loadLevel = (): boolean => {
    if (!level.value) {
      registry.clear();
      engine.value = null;
      gameState.value = null;
      executionResult.value = null;
      availableBlocks.value = [];
      clearProgram();
      return false;
    }

    //registerBlocksByIds(level.value.unlockedBlockIds);
    const blockIds = [
      ...new Set([
        ...level.value.unlockedBlockIds,
        // ...ALWAYS_AVAILABLE_BLOCK_IDS
      ])
    ];

    registerBlocksByIds(blockIds);
    availableBlocks.value = registry.getAllBlocks().map((block) => ({
      id: block.id,
      label: block.label,
      category: block.category
    }));
    const newEngine = createEngine(level.value);
    engine.value = newEngine;
    gameState.value = newEngine.getState().clone();
    executionResult.value = null;
    clearProgram();
    return true;
  };

  const addProgramBlock = (blockId: string, index?: number): boolean => {
    const block = registry.getBlock(blockId);
    if (!block) {
      return false;
    }

    if (index === undefined) {
      programBlocks.value.push(block);
      return true;
    }

    if (index < 0 || index > programBlocks.value.length) {
      return false;
    }

    programBlocks.value.splice(index, 0, block);
    return true;
  };

  const setProgram = (nodes: ProgramNode[]): boolean => {
    const buildBlocks = (nodeList: ProgramNode[]): BaseBlock[] | null => {
      const result: BaseBlock[] = [];

      for (const node of nodeList) {
        const block = registry.getBlock(node.blockId);
        if (!block) return null;

        if (node.repeatCount !== undefined && block instanceof RepeatBlock) {
          block.iterations = node.repeatCount;
        }

        if (node.children) {
          const childBlocks = buildBlocks(node.children);
          if (!childBlocks) return null;
          block.children = childBlocks;
        }

        if (block instanceof BaseIfBlock) {
          if (node.condition) {
            block.condition = node.condition;
          }
          if (node.customDx !== undefined) block.customDx = node.customDx;
          if (node.customDy !== undefined) block.customDy = node.customDy;
          if (node.trueChildren) {
            const tc = buildBlocks(node.trueChildren);
            if (!tc) return null;
            block.trueChildren = tc;
          }
          if (node.elseChildren) {
            const ec = buildBlocks(node.elseChildren);
            if (!ec) return null;
            block.elseChildren = ec;
          }
        }

        result.push(block);
      }

      return result;
    };

    const blocks = buildBlocks(nodes);
    if (!blocks) return false;
    programBlocks.value = blocks;
    return true;
  };

  const replaceProgramBlock = (index: number, blockId: string): boolean => {
    if (index < 0 || index >= programBlocks.value.length) {
      return false;
    }

    const replacement = registry.getBlock(blockId);
    if (!replacement) {
      return false;
    }

    programBlocks.value[index] = replacement;
    return true;
  };

  const deleteProgramBlock = (index: number): boolean => {
    if (index < 0 || index >= programBlocks.value.length) {
      return false;
    }
    programBlocks.value.splice(index, 1);
    return true;
  };

  const clearProgram = () => {
    programBlocks.value = [];
  };

  // Load the current level immediately and reload it when the route level id changes.
  watch(() => unref(levelId), loadLevel, { immediate: true, flush: 'sync' });

  const resetGame = (): void => {
    if (!level.value) return;
    const newEngine = createEngine(level.value);
    engine.value = newEngine;
    gameState.value = newEngine.getState().clone();
    executionResult.value = null;
  };

  const runProgram = (): boolean => {
    if (!level.value) {
      return false;
    }

    const newEngine = createEngine(level.value);
    engine.value = newEngine;
    newEngine.setDebug(true);
    executionResult.value = newEngine.run(programBlocks.value);
    gameState.value = newEngine.getState().clone();
    return true;
  };

  return {
    level,
    gameState,
    executionResult,
    availableBlocks,
    program,
    addProgramBlock,
    setProgram,
    replaceProgramBlock,
    deleteProgramBlock,
    clearProgram,
    resetGame,
    runProgram
  };
}

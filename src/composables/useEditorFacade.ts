import { computed, ref, shallowRef, unref, watch, type MaybeRef } from 'vue';
import { GameEngine } from '@/core/engine/GameEngine';
import { BlockRegistry } from '@/core/editor/BlockRegistry';
import { GameState } from '@/core/engine/GameState';
import type { BaseBlock } from '@/core/editor/BaseBlock';
import { BlockCategory } from '@/core/editor/BlockCategories';
import { getLevelById, type LevelDefinition } from '@/core/levels/levelCatalog';
import { registerBlocksByIds } from '@/core/setup/registerDefaultBlocks';

const registry = BlockRegistry.getInstance();

type AvailableBlock = {
  id: string
  category: BlockCategory
}

type RepeatProgramBlock = BaseBlock & {
  iterations: number
}

function createEngine(level: LevelDefinition): GameEngine {
  return new GameEngine(new GameState(level.grid, level.startX, level.startY));
}

export function useEditorFacade(levelId: MaybeRef<number>) {
  const engine = shallowRef<GameEngine | null>(null);
  const gameState = ref<GameState | null>(null);
  const availableBlocks = ref<AvailableBlock[]>([]);
  const programBlocks = ref<BaseBlock[]>([]);

  const level = computed(() => getLevelById(Number(unref(levelId))) ?? null);
  const program = computed(() => [...programBlocks.value]);

  const loadLevel = (): boolean => {
    if (!level.value) {
      registry.clear();
      engine.value = null;
      gameState.value = null;
      availableBlocks.value = [];
      clearProgram();
      return false;
    }

    registerBlocksByIds(level.value.unlockedBlockIds);
    availableBlocks.value = registry.getAllBlocks().map((block) => ({
      id: block.id,
      category: block.category
    }));
    const newEngine = createEngine(level.value);
    engine.value = newEngine;
    gameState.value = newEngine.getState().clone();
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

  const setRepeatIterations = (index: number, iterations: number): boolean => {
    if (index < 0 || index >= programBlocks.value.length) {
      return false;
    }

    if (!Number.isInteger(iterations) || iterations < 1) {
      return false;
    }

    const block = programBlocks.value[index];
    if (block.category !== BlockCategory.REPEAT) {
      return false;
    }

    (block as RepeatProgramBlock).iterations = iterations;
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

  const runProgram = (): boolean => {
    if (!level.value) {
      return false;
    }

    const newEngine = createEngine(level.value);
    engine.value = newEngine;
    newEngine.setDebug(true);
    newEngine.run(programBlocks.value);
    gameState.value = newEngine.getState().clone();
    return true;
  };

  return {
    level,
    gameState,
    availableBlocks,
    program,
    addProgramBlock,
    replaceProgramBlock,
    setRepeatIterations,
    deleteProgramBlock,
    clearProgram,
    runProgram
  };
}

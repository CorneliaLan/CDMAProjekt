import { ref, shallowRef } from 'vue';
import { GameEngine } from '@/core/engine/GameEngine';
import { BlockRegistry } from '@/core/editor/BlockRegistry';
import { GameState } from '@/core/engine/GameState';
import type { BaseBlock } from '@/core/editor/BaseBlock';

const registry = BlockRegistry.getInstance();

export function useEditorFacade() {
  const engine = shallowRef<GameEngine | null>(null);
  const reactiveGameState = ref<GameState | null>(null);

  const getAvailableBlocks = () => {
    return registry.getAllBlocks().map((block) => ({
      id: block.id,
      category: block.category
    }));
  };

  const loadLevel = (grid: number[][], startX: number, startY: number) => {
    const initialState = new GameState(grid, startX, startY);
    const newEngine = new GameEngine(initialState);

    engine.value = newEngine;
    reactiveGameState.value = newEngine.getState().clone();
  };

  const startGame = (program: BaseBlock[]) => {
    if (!engine.value) {
      return;
    }

    engine.value.run(program);
    reactiveGameState.value = engine.value.getState().clone();
  };

  return {
    gameState: reactiveGameState,
    getAvailableBlocks,
    loadLevel,
    startGame
  };
}

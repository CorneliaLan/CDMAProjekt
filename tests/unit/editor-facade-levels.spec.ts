import { describe, expect, test } from 'vitest';
import { ref } from 'vue';
import { useEditorFacade } from '../../src/composables/useEditorFacade';

function sortedBlockIds(blocks: Array<{ id: string }>): string[] {
  return blocks.map((block) => block.id).sort();
}

describe('useEditorFacade level runtime', () => {
  test('registers blocks based on selected level and replaces them when switching levels', () => {
    const levelId = ref(1);
    const facade = useEditorFacade(levelId);

    expect(facade.level.value?.id).toBe(1);
    expect(sortedBlockIds(facade.availableBlocks.value)).toEqual([
      'move-down',
      'move-left',
      'move-right',
      'move-up'
    ]);

    levelId.value = 2;
    expect(facade.level.value?.id).toBe(2);
    expect(sortedBlockIds(facade.availableBlocks.value)).toEqual([
      'move-down',
      'move-left',
      'move-right',
      'move-up',
      'repeat-x'
    ]);

    levelId.value = 3;
    expect(facade.level.value?.id).toBe(3);
    expect(sortedBlockIds(facade.availableBlocks.value)).toEqual([
      'if-wall',
      'move-down',
      'move-left',
      'move-right',
      'move-up',
      'repeat-x'
    ]);
  });

  test('supports add, insert, edit and delete program operations', () => {
    const facade = useEditorFacade(2);

    expect(facade.addProgramBlock('move-up')).toBe(true);
    expect(facade.addProgramBlock('repeat-x')).toBe(true);
    expect(facade.addProgramBlock('move-right', 1)).toBe(true);
    expect(facade.addProgramBlock('unknown-block')).toBe(false);
    expect(facade.addProgramBlock('move-left', 10)).toBe(false);
    expect(facade.program.value.map((block) => block.id)).toEqual(['move-up', 'move-right', 'repeat-x']);

    expect(facade.replaceProgramBlock(0, 'move-left')).toBe(true);
    expect(facade.setRepeatIterations(0, 2)).toBe(false);
    expect(facade.setRepeatIterations(2, 5)).toBe(true);
    expect(facade.replaceProgramBlock(99, 'move-up')).toBe(false);
    expect(facade.replaceProgramBlock(2, 'unknown-block')).toBe(false);
    expect((facade.program.value[2] as { iterations?: number }).iterations).toBe(5);
    expect(facade.program.value[2].id).toBe('repeat-x');

    expect(facade.deleteProgramBlock(1)).toBe(true);
    expect(facade.deleteProgramBlock(99)).toBe(false);
    expect(facade.program.value.map((block) => block.id)).toEqual(['move-left', 'repeat-x']);
  });

  test('runProgram always starts from the initial level state', () => {
    const facade = useEditorFacade(1);
    facade.addProgramBlock('move-up');

    expect(facade.runProgram()).toBe(true);
    expect(facade.gameState.value?.playerX).toBe(1);
    expect(facade.gameState.value?.playerY).toBe(2);

    expect(facade.runProgram()).toBe(true);
    expect(facade.gameState.value?.playerX).toBe(1);
    expect(facade.gameState.value?.playerY).toBe(2);
  });
});

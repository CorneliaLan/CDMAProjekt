export type LevelDefinition = {
  id: number
  title: string
  description: string
  grid: number[][]
  startX: number
  startY: number
  unlockedBlockIds: string[]
}

const MOVEMENT_BLOCK_IDS = ['move-up', 'move-right', 'move-down', 'move-left'];
const LEVEL_2_BLOCK_IDS = [...MOVEMENT_BLOCK_IDS, 'repeat-x'];
const LEVEL_3_TO_5_BLOCK_IDS = [...LEVEL_2_BLOCK_IDS, 'if-wall'];

/**
 * Central source of truth for level setup and block unlocks.
 */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    id: 1,
    title: 'Level 1',
    description: 'Learn movement on a compact map with a simple goal path.',

    // 1 - wall, 2 - chest, 3 - target, 0 - empty space
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 3, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 3,
    unlockedBlockIds: MOVEMENT_BLOCK_IDS
  },
  {
    id: 2,
    title: 'Level 2',
    description: 'Longer path with pockets and turns where repeat becomes useful.',
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 1,
    unlockedBlockIds: LEVEL_2_BLOCK_IDS
  },
  {
    id: 3,
    title: 'Level 3',
    description: 'Narrow corridors and branching choices introduce control blocks.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 3, 1],
      [1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 5,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  },
  {
    id: 4,
    title: 'Level 4',
    description: 'Bigger arena with detours and dead ends around central obstacles.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 3, 1],
      [1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 1],
      [1, 1, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 1,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  },
  {
    id: 5,
    title: 'Level 5',
    description: 'Final map with layered walls and a long optimal route.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 3, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 7,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  }
];

export function getLevelById(levelId: number): LevelDefinition | undefined {
  return LEVEL_DEFINITIONS.find((level) => level.id === levelId);
}

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
const LEVEL_3_TO_5_BLOCK_IDS = [...LEVEL_2_BLOCK_IDS, 'if-wall', 'if-chest'];
/**
 * Central source of truth for level setup and block unlocks.
 */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    id: 1,
    title: 'Level 1',
    description: 'Learn the basics by pushing a single chest onto the target.',

    // 1 - wall, 2 - chest, 3 - target, 0 - empty space
    grid: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 2, 3, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ],
    startX: 1,
    startY: 2,
    unlockedBlockIds: MOVEMENT_BLOCK_IDS
  },
  {
    id: 2,
    title: 'Level 2',
    description: 'Careful not to push the chest into a corner! Navigate around the wall.',
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 0, 3, 1, 0, 1],
      [1, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    startX: 4,
    startY: 2,
    unlockedBlockIds: LEVEL_2_BLOCK_IDS
  },
  {
    id: 3,
    title: 'Level 3',
    description: 'Double the trouble. Plan your moves so you don\'t block your own path.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 3, 3, 0, 0, 0, 1],
      [1, 0, 0, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 5,
    startY: 2,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  },
  {
    id: 4,
    title: 'Level 4',
    description: 'You can\'t go through walls! Maneuver the chest through the hallway and into the pocket.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 3, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 2, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 6,
    startY: 3,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  },
  {
    id: 5,
    title: 'Level 5',
    description: 'The ultimate challenge. 3 chests, 3 targets. Play the sequence carefully to avoid boxing yourself in.',
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 3, 3, 3, 0, 2, 0, 1],
      [1, 0, 0, 0, 1, 0, 2, 0, 1],
      [1, 1, 1, 0, 0, 0, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    startX: 7,
    startY: 3,
    unlockedBlockIds: LEVEL_3_TO_5_BLOCK_IDS
  }
];

export function getLevelById(levelId: number): LevelDefinition | undefined {
  return LEVEL_DEFINITIONS.find((level) => level.id === levelId);
}

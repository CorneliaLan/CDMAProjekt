import { GameState } from './GameState';

export interface ExecutionContext {
  state: GameState;
  isWallAt: (dx: number, dy: number) => boolean;
  isChestAt: (dx: number, dy: number) => boolean;
  isTargetAt: (dx: number, dy: number) => boolean;
  isWallAhead: () => boolean;
  isChestAhead: () => boolean;
  isTargetReached: () => boolean;
}

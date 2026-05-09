import { GameState } from './GameState';
import type { RuntimeError } from './ExecutionResult';

export interface ExecutionContext {
  state: GameState;
  movePlayer: (dx: number, dy: number) => void;
  isWallAt: (dx: number, dy: number) => boolean;
  isChestAt: (dx: number, dy: number) => boolean;
  isTargetAt: (dx: number, dy: number) => boolean;
  isWallAhead: () => boolean;
  isChestAhead: () => boolean;
  isTargetReached: () => boolean;
  getRuntimeError: () => RuntimeError | null;
  shouldStopExecution: () => boolean;
}

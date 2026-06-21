import { GameState } from './GameState';
import type { RuntimeError } from './ExecutionResult';
import type { BaseBlock } from '../editor/BaseBlock';

export interface ExecutionContext {
  state: GameState;
  executeBlock: (block: BaseBlock) => void;
  movePlayer: (dx: number, dy: number) => void;
  isWallAt: (dx: number, dy: number) => boolean;
  isChestAt: (dx: number, dy: number) => boolean;
  isTargetAt: (dx: number, dy: number) => boolean;
  isTargetReached: () => boolean;
  getRuntimeError: () => RuntimeError | null;
  shouldStopExecution: () => boolean;
}

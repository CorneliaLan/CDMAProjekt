import { BaseBlock } from '../editor/BaseBlock';
import { BlockCategory } from '../editor/BlockCategories';
import type { ExecutionResult, RuntimeError, RuntimeErrorCode } from './ExecutionResult';
import type { ExecutionContext } from './ExecutionContext';
import { GameState, TerrainCell } from './GameState';

export type ExecutionStep = {
  nodeId: string;
  blockId: string;
  state: GameState;
};

export type RunOptions = {
  startNodeId?: string;
};

/**
 * Executes Editor block programs against mutable level state.
 */
export class GameEngine {
  private readonly state: GameState;
  private debugEnabled = false;
  private runtimeError: RuntimeError | null = null;
  private lastResult: ExecutionResult = {
    completed: false,
    runtimeError: null,
    stepsExecuted: 0
  };

  private snapshots: GameState[] = []
  private executionTrace: ExecutionStep[] = []

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  /**
   * Enables or disables step-by-step execution logging.
   */
  public setDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  private createContext(executeBlock: (block: BaseBlock) => void): ExecutionContext {
    return {
      state: this.state,
      executeBlock,
      movePlayer: (dx: number, dy: number) => this.movePlayer(dx, dy),
      isWallAt: (dx: number, dy: number) => this.isWallAt(this.state.playerX + dx, this.state.playerY + dy),
      isChestAt: (dx: number, dy: number) => this.state.hasChestAt(this.state.playerX + dx, this.state.playerY + dy),
      isTargetAt: (dx: number, dy: number) => this.isTargetAt(this.state.playerX + dx, this.state.playerY + dy),
      isTargetReached: () => this.isLevelCompleted(),
      getRuntimeError: () => this.runtimeError,
      shouldStopExecution: () => this.runtimeError !== null || this.isLevelCompleted()
    };
  }

  private movePlayer(dx: number, dy: number): void {
    if (this.runtimeError) {
      return;
    }

    const nextX = this.state.playerX + dx;
    const nextY = this.state.playerY + dy;

    if (this.isWallAt(nextX, nextY)) {
      this.recordRuntimeError('blocked-by-wall', 'The player tried to move into a wall.', dx, dy, nextX, nextY);
      return;
    }

    const chestIndex = this.state.getChestIndexAt(nextX, nextY);
    if (chestIndex === -1) {
      this.state.movePlayerTo(nextX, nextY);
      return;
    }

    const pushedChestX = nextX + dx;
    const pushedChestY = nextY + dy;

    if (this.isWallAt(pushedChestX, pushedChestY)) {
      this.recordRuntimeError(
        'blocked-by-chest-against-wall',
        'The player tried to push a chest into a wall.',
        dx,
        dy,
        pushedChestX,
        pushedChestY
      );
      return;
    }

    if (this.state.hasChestAt(pushedChestX, pushedChestY)) {
      this.recordRuntimeError(
        'blocked-by-chest',
        'The player tried to push a chest into another chest.',
        dx,
        dy,
        pushedChestX,
        pushedChestY
      );
      return;
    }

    this.state.moveChest(chestIndex, pushedChestX, pushedChestY);
    this.state.movePlayerTo(nextX, nextY);
  }

  private isWallAt(x: number, y: number): boolean {
    const terrainCell = this.state.getTerrainCell(x, y);

    // Treat out-of-bounds as wall so movement stays inside the level.
    return terrainCell !== TerrainCell.Empty && terrainCell !== TerrainCell.Target;
  }

  private isTargetAt(x: number, y: number): boolean {
    return this.state.getTerrainCell(x, y) === TerrainCell.Target;
  }

  private isLevelCompleted(): boolean {
    return this.state.chestPositions.length > 0
      && this.state.chestPositions.every((chest) => this.isTargetAt(chest.x, chest.y));
  }

  private recordRuntimeError(
    code: RuntimeErrorCode,
    message: string,
    dx: number,
    dy: number,
    blockedX: number,
    blockedY: number
  ): void {
    this.runtimeError = {
      code,
      message,
      playerPosition: {
        x: this.state.playerX,
        y: this.state.playerY
      },
      attemptedMove: {
        dx,
        dy
      },
      blockedPosition: {
        x: blockedX,
        y: blockedY
      }
    };
  }

  public run(program: BaseBlock[], options: RunOptions = {}): ExecutionResult {
    this.runtimeError = null;
    this.snapshots = []
    this.executionTrace = []
    let stepsExecuted = 0;
    let context!: ExecutionContext;

    const recordState = (nodeId: string, blockId: string) => {
      const snapshot = this.state.clone();

      this.snapshots.push(snapshot);
      this.executionTrace.push({
        nodeId,
        blockId,
        state: snapshot
      });
    };

    const executeBlock = (block: BaseBlock) => {
      if (context.shouldStopExecution()) {
        return;
      }

      block.execute(context);

      if (block.category !== BlockCategory.ACTION) {
        return;
      }

      stepsExecuted += 1;

      if (this.debugEnabled) {
        console.log(`[GameEngine] ${stepsExecuted}. ${block.id} -> (${this.state.playerX}, ${this.state.playerY})`);
      }

      recordState(block.sourceNodeId ?? block.id, block.id);
    };

    context = this.createContext(executeBlock);

    recordState(options.startNodeId ?? 'level-start', 'level-start')

    for (const block of program) {
      if (context.shouldStopExecution()) {
        break;
      }

      executeBlock(block);

      if (context.shouldStopExecution()) {
        break;
      }
    }

    this.lastResult = {
      completed: this.isLevelCompleted(),
      runtimeError: this.runtimeError,
      stepsExecuted
    };

    return this.lastResult;
  }

  public getState(): GameState {
    return this.state;
  }

  public getLastResult(): ExecutionResult {
    return this.lastResult;
  }

  getSnapshots(): GameState[] {
    return this.snapshots;
  }

  getExecutionTrace(): ExecutionStep[] {
    return this.executionTrace;
  }
}

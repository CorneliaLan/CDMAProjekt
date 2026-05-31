import { BaseBlock } from '../editor/BaseBlock';
import type { ExecutionResult, RuntimeError, RuntimeErrorCode } from './ExecutionResult';
import { ExecutionContext } from './ExecutionContext';
import { GameState, TerrainCell } from './GameState';

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

  constructor(initialState: GameState) {
    this.state = initialState;
  }

  /**
   * Enables or disables step-by-step execution logging.
   */
  public setDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  private createContext(): ExecutionContext {
    return {
      state: this.state,
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

  public run(program: BaseBlock[]): ExecutionResult {
    this.runtimeError = null;
    const context = this.createContext();
    let stepsExecuted = 0;

    for (const [stepIndex, block] of program.entries()) {
      if (context.shouldStopExecution()) {
        break;
      }

      block.execute(context);
      stepsExecuted = stepIndex + 1;

      if (this.debugEnabled) {
        console.log(`[GameEngine] ${stepIndex + 1}. ${block.id} -> (${this.state.playerX}, ${this.state.playerY})`);
      }

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
}

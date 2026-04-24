import { BaseBlock } from '../editor/BaseBlock';
import { ExecutionContext } from './ExecutionContext';
import { GameState } from './GameState';

/**
 * Executes Editor block programs against mutable level state.
 */
export class GameEngine {
  private readonly state: GameState;
  private debugEnabled = false;

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
      isWallAt: (dx: number, dy: number) => this.getCell(this.state.playerX + dx, this.state.playerY + dy) === 1,
      isChestAt: (dx: number, dy: number) => this.getCell(this.state.playerX + dx, this.state.playerY + dy) === 2,
      isTargetAt: (dx: number, dy: number) => this.getCell(this.state.playerX + dx, this.state.playerY + dy) === 3,
      // Keep "ahead" aligned to upward movement for compatibility.
      isWallAhead: () => this.getCell(this.state.playerX, this.state.playerY - 1) === 1,
      isChestAhead: () => this.getCell(this.state.playerX, this.state.playerY - 1) === 2,
      isTargetReached: () => this.getCell(this.state.playerX, this.state.playerY) === 3
    };
  }

  private getCell(x: number, y: number): number {
    const row = this.state.grid[y];
    if (!row || x < 0 || x >= row.length) {
      // Treat out-of-bounds as wall so movement stays inside the level.
      return 1;
    }
    return row[x];
  }

  public run(program: BaseBlock[]): void {
    const context = this.createContext();

    for (const [stepIndex, block] of program.entries()) {
      block.execute(context);
      if (this.debugEnabled) {
        console.log(`[GameEngine] ${stepIndex + 1}. ${block.id} -> (${this.state.playerX}, ${this.state.playerY})`);
      }

      if (context.isTargetReached()) {
        break;
      }
    }
  }

  public getState(): GameState {
    return this.state;
  }
}

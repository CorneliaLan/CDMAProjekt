/**
 * Mutable game snapshot used by the engine while executing the Editor program.
 */
export class GameState {
  public playerX: number = 0;
  public playerY: number = 0;
  // Grid cell types: 0 = empty, 1 = wall, 2 = chest, 3 = target.
  public grid: number[][] = [];

  constructor(initialGrid: number[][], startX: number, startY: number) {
    this.grid = initialGrid.map((row) => [...row]);
    this.playerX = startX;
    this.playerY = startY;
  }

  public clone(): GameState {
    return new GameState(this.grid, this.playerX, this.playerY);
  }
}

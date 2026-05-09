export enum TerrainCell {
  Empty = 0,
  Wall = 1,
  Target = 3
}

export enum RenderCell {
  Empty = 0,
  Wall = 1,
  Chest = 2,
  Target = 3,
  ChestOnTarget = 4
}

export type GridPosition = {
  x: number
  y: number
}

/**
 * Mutable game snapshot used by the engine while executing the Editor program.
 */
export class GameState {
  public playerX: number = 0;
  public playerY: number = 0;
  // Static terrain and dynamic chests stay separate so targets survive chest movement.
  public terrain: TerrainCell[][] = [];
  public chestPositions: GridPosition[] = [];
  // Derived render grid kept for existing preview components.
  public grid: RenderCell[][] = [];

  constructor(initialGrid: number[][], startX: number, startY: number, chestPositions?: GridPosition[]) {
    this.playerX = startX;
    this.playerY = startY;

    if (chestPositions) {
      this.terrain = initialGrid.map((row) => row.map((cell) => this.toTerrainCell(cell)));
      this.chestPositions = chestPositions.map((position) => ({ ...position }));
    } else {
      this.parseLevelGrid(initialGrid);
    }

    this.refreshRenderGrid();
  }

  public clone(): GameState {
    return new GameState(this.terrain, this.playerX, this.playerY, this.chestPositions);
  }

  public getTerrainCell(x: number, y: number): TerrainCell | null {
    const row = this.terrain[y];
    if (!row || x < 0 || x >= row.length) {
      return null;
    }

    return row[x];
  }

  public getChestIndexAt(x: number, y: number): number {
    return this.chestPositions.findIndex((position) => position.x === x && position.y === y);
  }

  public hasChestAt(x: number, y: number): boolean {
    return this.getChestIndexAt(x, y) !== -1;
  }

  public movePlayerTo(x: number, y: number): void {
    this.playerX = x;
    this.playerY = y;
  }

  public moveChest(chestIndex: number, x: number, y: number): void {
    const chest = this.chestPositions[chestIndex];
    if (!chest) {
      return;
    }

    chest.x = x;
    chest.y = y;
    this.refreshRenderGrid();
  }

  private parseLevelGrid(initialGrid: number[][]): void {
    this.terrain = initialGrid.map((row, y) => row.map((cell, x) => {
      if (cell === RenderCell.Chest) {
        this.chestPositions.push({ x, y });
        return TerrainCell.Empty;
      }

      return this.toTerrainCell(cell);
    }));
  }

  private toTerrainCell(cell: number): TerrainCell {
    if (cell === TerrainCell.Wall) {
      return TerrainCell.Wall;
    }

    if (cell === TerrainCell.Target || cell === RenderCell.ChestOnTarget) {
      return TerrainCell.Target;
    }

    return TerrainCell.Empty;
  }

  private refreshRenderGrid(): void {
    this.grid = this.terrain.map((row) => row.map((cell) => {
      if (cell === TerrainCell.Wall) {
        return RenderCell.Wall;
      }

      if (cell === TerrainCell.Target) {
        return RenderCell.Target;
      }

      return RenderCell.Empty;
    }));

    for (const chest of this.chestPositions) {
      const row = this.grid[chest.y];
      if (!row || chest.x < 0 || chest.x >= row.length) {
        continue;
      }

      row[chest.x] = this.terrain[chest.y][chest.x] === TerrainCell.Target
        ? RenderCell.ChestOnTarget
        : RenderCell.Chest;
    }
  }
}

import type { TerrainCell, RenderCell, GridPosition } from './GameState'

export type GameStateView = {
  playerX: number
  playerY: number
  terrain: TerrainCell[][]
  chestPositions: GridPosition[]
  grid: RenderCell[][]
}
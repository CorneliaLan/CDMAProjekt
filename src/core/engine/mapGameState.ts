import type { GameState } from './GameState'
import type { GameStateView } from './GameStateView'

export function mapGameState(state: GameState): GameStateView {
  return {
    playerX: state.playerX,
    playerY: state.playerY,
    terrain: state.terrain,
    grid: state.grid,
    chestPositions: state.chestPositions
  }
}
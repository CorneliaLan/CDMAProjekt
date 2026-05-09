export type RuntimeErrorCode =
  | 'blocked-by-wall'
  | 'blocked-by-chest-against-wall'
  | 'blocked-by-chest';

export type RuntimeError = {
  code: RuntimeErrorCode
  message: string
  playerPosition: {
    x: number
    y: number
  }
  attemptedMove: {
    dx: number
    dy: number
  }
  // Cell that blocked the action, useful for later UI highlighting.
  blockedPosition: {
    x: number
    y: number
  }
}

export type ExecutionResult = {
  completed: boolean
  runtimeError: RuntimeError | null
  stepsExecuted: number
}

import { describe, expect, test } from 'vitest';
import {MoveDownBlock} from "../../src/core/editor/blocks/action/MoveDownBlock";
import {MoveLeftBlock} from "../../src/core/editor/blocks/action/MoveLeftBlock";
import {MoveUpBlock} from "../../src/core/editor/blocks/action/MoveUpBlock";
import {MoveRightBlock} from "../../src/core/editor/blocks/action/MoveRightBlock";
import {GameState} from "../../src/core/engine/GameState";
import {GameEngine} from "../../src/core/engine/GameEngine";

describe('GameEngine movement flow', () => {
  test('prints execution steps in debug mode and reaches expected final position', () => {
    const level = [
      [0, 0, 0, 0, 0, 0],
      [0, 1, 0, 2, 0, 3],
      [0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0]
    ];
    const initialState = new GameState(level, 2, 4);
    const engine = new GameEngine(initialState);

    engine.setDebug(true);

    const program = [
      new MoveLeftBlock(),
      new MoveDownBlock(),
      new MoveUpBlock(),
      new MoveUpBlock(),
      new MoveUpBlock(),
      new MoveRightBlock(),
      new MoveRightBlock(),
      new MoveUpBlock(),
      new MoveRightBlock(),
      new MoveRightBlock(),
      new MoveRightBlock()
    ];

    engine.run(program);
    const endState = engine.getState();

    expect(endState.playerX).toBe(5);
    expect(endState.playerY).toBe(1);
  });
});

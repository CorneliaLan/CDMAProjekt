import { describe, expect, it } from 'vitest';
import { MoveDownBlock } from '@/core/editor/blocks/action/MoveDownBlock';
import { MoveLeftBlock } from '@/core/editor/blocks/action/MoveLeftBlock';
import { MoveRightBlock } from '@/core/editor/blocks/action/MoveRightBlock';
import { IfWallBlock } from '@/core/editor/blocks/control/IfWallBlock';
import { RepeatBlock } from '@/core/editor/blocks/repeat/RepeatBlock';
import { GameEngine } from '@/core/engine/GameEngine';
import { GameState } from '@/core/engine/GameState';

const createEngine = () => new GameEngine(new GameState([
  [1, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 0, 3, 1],
  [1, 1, 1, 1]
], 1, 1));

describe('GameEngine execution trace', () => {
  it('records only the start step for an empty program', () => {
    const engine = createEngine();

    const result = engine.run([], { startNodeId: 'start-node' });
    const trace = engine.getExecutionTrace();

    expect(result.stepsExecuted).toBe(0);
    expect(trace).toHaveLength(1);
    expect(trace[0].nodeId).toBe('start-node');
    expect(trace[0].blockId).toBe('level-start');
    expect(trace[0].state.playerX).toBe(1);
    expect(trace[0].state.playerY).toBe(1);
  });

  it('records one step for each executed action block', () => {
    const engine = createEngine();
    const moveRight = new MoveRightBlock();
    const moveDown = new MoveDownBlock();

    moveRight.sourceNodeId = 'move-right-node';
    moveDown.sourceNodeId = 'move-down-node';

    const result = engine.run([moveRight, moveDown], { startNodeId: 'start-node' });
    const trace = engine.getExecutionTrace();

    expect(result.stepsExecuted).toBe(2);
    expect(trace.map((step) => step.nodeId)).toEqual([
      'start-node',
      'move-right-node',
      'move-down-node'
    ]);
    expect(trace[1].state.playerX).toBe(2);
    expect(trace[1].state.playerY).toBe(1);
    expect(trace[2].state.playerX).toBe(2);
    expect(trace[2].state.playerY).toBe(2);
  });

  it('records repeated child action steps with the child node id', () => {
    const engine = createEngine();
    const repeat = new RepeatBlock(2);
    const moveRight = new MoveRightBlock();

    repeat.sourceNodeId = 'repeat-node';
    moveRight.sourceNodeId = 'nested-move-node';
    repeat.children = [moveRight];

    const result = engine.run([repeat], { startNodeId: 'start-node' });
    const trace = engine.getExecutionTrace();

    expect(result.stepsExecuted).toBe(2);
    expect(trace.map((step) => step.nodeId)).toEqual([
      'start-node',
      'nested-move-node',
      'nested-move-node'
    ]);
    expect(trace[2].state.playerX).toBe(2);
    expect(trace[2].state.playerY).toBe(1);
    expect(result.runtimeError?.code).toBe('blocked-by-wall');
  });

  it('records only actions from the chosen if branch', () => {
    const engine = createEngine();
    const ifWall = new IfWallBlock();
    const trueMove = new MoveRightBlock();
    const elseMove = new MoveDownBlock();

    ifWall.condition = 'wallUp';
    ifWall.sourceNodeId = 'if-node';
    trueMove.sourceNodeId = 'true-move-node';
    elseMove.sourceNodeId = 'else-move-node';
    ifWall.trueChildren = [trueMove];
    ifWall.elseChildren = [elseMove];

    const result = engine.run([ifWall], { startNodeId: 'start-node' });
    const trace = engine.getExecutionTrace();

    expect(result.stepsExecuted).toBe(1);
    expect(trace.map((step) => step.nodeId)).toEqual([
      'start-node',
      'true-move-node'
    ]);
    expect(trace[1].state.playerX).toBe(2);
    expect(trace[1].state.playerY).toBe(1);
  });

  it('records the failing action step for runtime errors', () => {
    const engine = createEngine();
    const moveLeft = new MoveLeftBlock();

    moveLeft.sourceNodeId = 'bad-move-node';

    const result = engine.run([moveLeft], { startNodeId: 'start-node' });
    const trace = engine.getExecutionTrace();

    expect(result.stepsExecuted).toBe(1);
    expect(result.runtimeError?.code).toBe('blocked-by-wall');
    expect(trace.map((step) => step.nodeId)).toEqual([
      'start-node',
      'bad-move-node'
    ]);
    expect(trace[1].state.playerX).toBe(1);
    expect(trace[1].state.playerY).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import {
  TimelineScene,
  buildTimeline,
  findScene,
  stepScene,
} from './timeline';

const at = (ms: number) => new Date(1_700_000_000_000 + ms);
const scene = (action: string, ms: number): TimelineScene => ({ action, time: at(ms) });

describe('buildTimeline', () => {
  it('gives actions with a fixed duration that duration, and the last scene none', () => {
    const { durations } = buildTimeline([
      scene('attack', 0),
      scene('spell', 10),
      scene('monster', 20),
    ]);
    expect(durations).toEqual([1000, 1000, 0]);
  });

  it('uses the real gap to the next scene, up to three seconds', () => {
    const { durations } = buildTimeline([
      scene('monster', 0),
      scene('monster', 500),
      scene('monster', 20_500),
      scene('monster', 20_600),
    ]);
    expect(durations).toEqual([500, 3000, 100, 0]);
  });

  it('keeps plain updates short', () => {
    const { durations } = buildTimeline([
      scene('update', 0),
      scene('update', 2500),
      scene('update', 2600),
    ]);
    expect(durations).toEqual([200, 100, 0]);
  });

  it('never goes negative or NaN when times are out of order or missing', () => {
    const broken: TimelineScene = { action: 'monster', time: new Date(Number.NaN) };
    const { durations } = buildTimeline([
      scene('monster', 500),
      scene('monster', 100),
      broken,
      scene('monster', 0),
    ]);
    expect(durations).toEqual([0, 0, 0, 0]);
  });

  it('adds the durations up to scene start times and a total', () => {
    const { starts, total } = buildTimeline([
      scene('attack', 0),
      scene('monster', 5),
      scene('monster', 305),
      scene('monster', 400),
    ]);
    expect(starts).toEqual([0, 1000, 1300, 1395]);
    expect(total).toBe(1395);
  });

  it('points updates, logs and animations at the event before them', () => {
    const { event } = buildTimeline([
      scene('init', 0),
      scene('attack', 1),
      scene('update', 2),
      scene('log', 3),
      scene('update', 4),
      scene('spell', 5),
      scene('animation', 6),
      scene('log', 7),
      scene('unknown', 8),
      scene('emote', 9),
      scene('cardEffect', 10),
      scene('animation', 11),
    ]);
    expect(event).toEqual([0, 1, 1, 1, 1, 5, 5, 5, 5, 5, 10, 10]);
  });

  it('only counts real events as steps', () => {
    const { steps } = buildTimeline([
      scene('init', 0),
      scene('gameTurn', 1),
      scene('playerTurn', 2),
      scene('update', 3),
      scene('attack', 4),
      scene('log', 5),
      scene('unknown', 6),
      scene('emote', 7),
      scene('animation', 8),
      scene('finish', 9),
    ]);
    expect(steps).toEqual([2, 4, 9]);
  });

  it('copes with a game that has no scenes', () => {
    const timeline = buildTimeline([]);
    expect(timeline).toEqual({
      durations: [], starts: [], total: 0, event: [], steps: [],
    });
    expect(findScene(timeline, 500)).toBe(0);
    expect(stepScene(timeline, 0, 1)).toBe(0);
    expect(stepScene(timeline, 0, -1)).toBe(0);
  });
});

describe('findScene', () => {
  const timeline = buildTimeline([
    scene('attack', 0),
    scene('monster', 5),
    scene('monster', 305),
    scene('monster', 400),
  ]);

  it('finds the scene showing at a time', () => {
    expect(findScene(timeline, 0)).toBe(0);
    expect(findScene(timeline, 999)).toBe(0);
    expect(findScene(timeline, 1000)).toBe(1);
    expect(findScene(timeline, 1299)).toBe(1);
    expect(findScene(timeline, 1300)).toBe(2);
  });

  it('clamps before the start and after the end', () => {
    expect(findScene(timeline, -50)).toBe(0);
    expect(findScene(timeline, 99_999)).toBe(3);
  });
});

describe('stepScene', () => {
  const timeline = buildTimeline([
    scene('init', 0),
    scene('playerTurn', 1),
    scene('update', 2),
    scene('attack', 3),
    scene('update', 4),
    scene('spell', 5),
    scene('update', 6),
  ]);

  it('moves to the next event, and to the end after the last one', () => {
    expect(stepScene(timeline, 0, 1)).toBe(1);
    expect(stepScene(timeline, 1, 1)).toBe(3);
    expect(stepScene(timeline, 4, 1)).toBe(5);
    expect(stepScene(timeline, 5, 1)).toBe(6);
    expect(stepScene(timeline, 6, 1)).toBe(6);
  });

  it('moves to the previous event, and to the start before the first', () => {
    expect(stepScene(timeline, 6, -1)).toBe(5);
    expect(stepScene(timeline, 5, -1)).toBe(3);
    expect(stepScene(timeline, 4, -1)).toBe(3);
    expect(stepScene(timeline, 1, -1)).toBe(0);
    expect(stepScene(timeline, 0, -1)).toBe(0);
  });
});

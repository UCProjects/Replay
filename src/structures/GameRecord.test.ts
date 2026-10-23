import { describe, expect, it } from 'vitest';
import { GameRecord } from './GameRecord';

const stamp = (ms: number) => ({ toDate: () => new Date(ms) });

const record = (results: unknown) => new GameRecord({
  cards: 'cards',
  date: stamp(2),
  id: 1,
  playermeta: {
    ids: [0, 780490],
    levels: [1, 5],
    names: ['story-fight-12-name', 'UlF1'],
    ranks: ['', ''],
    souls: ['MONSTER', 'KINDNESS'],
  },
  results,
  start: stamp(1),
  translation: 'lang',
  type: 'STORY',
} as unknown as ConstructorParameters<typeof GameRecord>[0], 'key');

describe('GameRecord results', () => {
  it('finds the winner by id', () => {
    const { results } = record({ type: 'game-end-lethal', winner: 780490 });
    expect(results.winner?.name).toBe('UlF1');
  });

  it('counts the story opponent, whose id is zero, as the winner', () => {
    const { results } = record({ type: 'game-end-lethal', winner: 0 });
    expect(results.winner?.name).toBe('story-fight-12-name');
  });

  it('has no winner when there is none', () => {
    expect(record(null).results).toEqual({ type: 'timeout', winner: null });
    expect(record({ type: 'timeout' }).results.winner).toBeNull();
    expect(record({ type: 'timeout', winner: null }).results.winner).toBeNull();
  });
});

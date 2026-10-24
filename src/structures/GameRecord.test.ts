import { Timestamp } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import {
  GameInfo,
  GameRecord,
  reviveRecord,
  serializeRecord,
} from './GameRecord';

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

const info = (overrides: Partial<GameInfo> = {}): GameInfo => ({
  cards: 'cards-1',
  date: Timestamp.fromMillis(2_000_000),
  id: 42,
  playermeta: {
    ids: [1, 2],
    levels: [10, 20],
    names: ['Frisk', 'Chara'],
    ranks: ['E1', 'D2'],
    souls: ['DETERMINATION', 'KINDNESS'],
  },
  results: { type: 'surrender', winner: 2 },
  start: Timestamp.fromMillis(1_000_000),
  translation: 'lang-1',
  type: 'RANKED',
  ...overrides,
} as GameInfo);

describe('serializeRecord and reviveRecord', () => {
  it('gives back an equal saved', () => {
    const saved = new GameRecord(info(), 'g1');
    const revived = reviveRecord('g1', serializeRecord(saved)!)!;
    expect(revived.key).toBe('g1');
    expect(revived.date).toEqual(saved.date);
    expect(revived.start).toEqual(saved.start);
    expect(revived.users).toEqual(saved.users);
    expect(revived.results.winner?.name).toBe('Chara');
    expect(revived.kept).toBe(true);
  });

  it('keeps a game that is still on its expiry apart from a kept one', () => {
    const saved = new GameRecord(info({ expireAt: Timestamp.fromMillis(3_000_000) }), 'g1');
    const revived = reviveRecord('g1', serializeRecord(saved)!)!;
    expect(revived.kept).toBe(false);
  });

  it('can save a saved that was itself revived', () => {
    const revived = reviveRecord('g1', serializeRecord(new GameRecord(info(), 'g1'))!)!;
    expect(reviveRecord('g1', serializeRecord(revived)!)?.users).toEqual(revived.users);
  });

  it('gives nothing back for damaged data', () => {
    expect(reviveRecord('g1', 'not json')).toBeUndefined();
    expect(reviveRecord('g1', '{}')).toBeUndefined();
    expect(reviveRecord('g1', JSON.stringify({ date: 1, start: 2 }))).toBeUndefined();
  });
});

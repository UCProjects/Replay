import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import search from '~/managers/search';
import { GameRecord } from '~/structures/GameRecord';
import searchRecent, { cachedRecent, history } from './searchRecent';

vi.mock('~/managers/search', () => ({ default: vi.fn() }));

const mocked = vi.mocked(search);
const game = (minutes: number) => ({ date: new Date(minutes * 60_000), key: `g${minutes}` }) as GameRecord;

describe('searchRecent', () => {
  beforeEach(() => {
    history.length = 0;
    mocked.mockReset();
  });

  it('loads one batch the first time and keeps it', async () => {
    mocked.mockResolvedValueOnce([game(3), game(2)]);
    const games = await searchRecent(5);
    expect(games.map(({ key }) => key)).toEqual(['g3', 'g2']);
    expect(mocked).toHaveBeenCalledTimes(1);
    expect(mocked.mock.calls[0][0]).toMatchObject({ limit: 5, newer: false, previous: undefined });
    expect(cachedRecent()).toHaveLength(2);
  });

  it('asks only for games newer than the newest it has, and puts them on top', async () => {
    mocked.mockResolvedValueOnce([game(3), game(2)]);
    await searchRecent(5);
    mocked.mockResolvedValueOnce([game(5), game(4)]);
    const games = await searchRecent(5);
    expect(games.map(({ key }) => key)).toEqual(['g5', 'g4', 'g3', 'g2']);
    expect(mocked.mock.calls[1][0]).toMatchObject({ newer: true, previous: game(3).date });
  });

  it('keeps asking while a batch comes back full, so no games are skipped', async () => {
    mocked.mockResolvedValueOnce([game(1)]);
    await searchRecent(2);
    mocked
      .mockResolvedValueOnce([game(3), game(2)])
      .mockResolvedValueOnce([game(5), game(4)])
      .mockResolvedValueOnce([game(6)]);
    const games = await searchRecent(2);
    expect(games.map(({ key }) => key)).toEqual(['g6', 'g5', 'g4', 'g3', 'g2', 'g1']);
    expect(mocked).toHaveBeenCalledTimes(4);
  });

  it('keeps no more than a few hundred games, dropping the oldest', async () => {
    const many = Array.from({ length: 400 }, (_, i) => game(400 - i));
    mocked.mockResolvedValueOnce(many);
    const games = await searchRecent(500);
    expect(games).toHaveLength(300);
    expect(games[0].key).toBe('g400');
    expect(games[299].key).toBe('g101');
  });
});

import { describe, expect, it } from 'vitest';
import { daysSince, isOldKept } from './retention';

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 9, 23);
const game = (ageDays: number, kept = true) => ({
  date: new Date(now - ageDays * DAY_MS),
  key: 'g1',
  kept,
});

describe('isOldKept', () => {
  it('flags a game that is past the retention period and only survives as a favorite', () => {
    expect(isOldKept(game(31), [], now)).toBe(true);
  });

  it('leaves a game inside the retention period alone', () => {
    expect(isOldKept(game(29), [], now)).toBe(false);
  });

  it('leaves a game that is still on its normal expiry alone', () => {
    expect(isOldKept(game(31, false), [], now)).toBe(false);
  });

  it('leaves a game the user already favorited alone', () => {
    expect(isOldKept(game(90), ['g1'], now)).toBe(false);
  });
});

describe('daysSince', () => {
  it('counts whole days', () => {
    expect(daysSince(new Date(now - 3.5 * DAY_MS), now)).toBe(3);
  });
});

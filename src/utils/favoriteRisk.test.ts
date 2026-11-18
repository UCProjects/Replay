import { describe, expect, it } from 'vitest';
import { expiresSoonAfterUnfavorite } from './favoriteRisk';

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 14);

describe('expiresSoonAfterUnfavorite', () => {
  it('is false for a game that would still be kept for its 30 days', () => {
    expect(expiresSoonAfterUnfavorite(new Date(NOW - 2 * DAY_MS), NOW)).toBe(false);
    expect(expiresSoonAfterUnfavorite(new Date(NOW - 29 * DAY_MS + 1), NOW)).toBe(false);
  });

  it('is true once removing it would leave only the one day of grace', () => {
    expect(expiresSoonAfterUnfavorite(new Date(NOW - 29 * DAY_MS), NOW)).toBe(true);
    expect(expiresSoonAfterUnfavorite(new Date(NOW - 90 * DAY_MS), NOW)).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import {
  searchWindowDays,
  searchWindowStart,
} from './searchWindow';

describe('searchWindowDays', () => {
  it('gives guests one day, signed in users a week and paid users a month', () => {
    expect(searchWindowDays(null)).toBe(1);
    expect(searchWindowDays({})).toBe(7);
    expect(searchWindowDays({ pro: true })).toBe(30);
  });

  it('counts a pro expiry only until it passes', () => {
    expect(searchWindowDays({ pro: 2000 }, 1000)).toBe(30);
    expect(searchWindowDays({ pro: 2000 }, 2000)).toBe(30);
    expect(searchWindowDays({ pro: 2000 }, 2001)).toBe(7);
  });

  it('ignores a pro claim that is not true or a number', () => {
    expect(searchWindowDays({ pro: 'yes' })).toBe(7);
    expect(searchWindowDays({ pro: false })).toBe(7);
  });

  it('gives admins the longest window', () => {
    expect(searchWindowDays({ admin: true })).toBe(30);
    expect(searchWindowDays({ admin: 'true' })).toBe(7);
  });
});

describe('searchWindowStart', () => {
  it('goes back whole days from now', () => {
    const now = Date.UTC(2026, 9, 23, 12);
    expect(searchWindowStart(7, now).toISOString()).toBe('2026-10-16T12:00:00.000Z');
  });
});

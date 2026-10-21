import { describe, expect, it } from 'vitest';
import { searchToken } from './searchToken';

describe('searchToken', () => {
  it('has nothing to search for without a player or soul', () => {
    expect(searchToken()).toBeUndefined();
    expect(searchToken({ id: '0', name: '', soul: 'ANY' })).toBeUndefined();
  });

  it('searches a player by lowercase name', () => {
    expect(searchToken({ name: 'Frisk' })).toBe('n:frisk');
  });

  it('prefers an id over a name', () => {
    expect(searchToken({ id: '42', name: 'Frisk' })).toBe('i:42');
  });

  it('ignores an id that is not a whole number', () => {
    expect(searchToken({ id: 'abc', name: 'Frisk' })).toBe('n:frisk');
    expect(searchToken({ id: '1.5' })).toBeUndefined();
  });

  it('searches a soul on its own', () => {
    expect(searchToken({ soul: 'KINDNESS' })).toBe('s:KINDNESS');
  });

  it('pairs a player with a soul so it is that player on that soul', () => {
    expect(searchToken({ name: 'Frisk', soul: 'JUSTICE' })).toBe('n:frisk|s:JUSTICE');
    expect(searchToken({ id: '7', soul: 'PATIENCE' })).toBe('i:7|s:PATIENCE');
  });
});

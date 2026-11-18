import { describe, expect, it } from 'vitest';
import {
  EMPTY_QUERY,
  hasQuery,
  parseQuery,
  fightParams,
  playerParams,
  toParams,
} from './searchQuery';

describe('searchQuery', () => {
  it('reads nothing from empty params', () => {
    expect(parseQuery(new URLSearchParams())).toEqual(EMPTY_QUERY);
    expect(hasQuery(EMPTY_QUERY)).toBe(false);
  });

  it('round trips a full query', () => {
    const query = {
      fight: '',
      id: '42',
      mode: 'RANKED' as const,
      name: 'Frisk',
      soul: 'JUSTICE' as const,
    };
    expect(parseQuery(toParams(query))).toEqual(query);
    expect(hasQuery(query)).toBe(true);
  });

  it('leaves defaults out of the url', () => {
    expect(toParams(EMPTY_QUERY).toString()).toBe('');
    expect(toParams({ ...EMPTY_QUERY, soul: 'KINDNESS' }).toString()).toBe('soul=KINDNESS');
  });

  it('ignores values it does not know', () => {
    const params = new URLSearchParams('mode=NOPE&soul=NOPE&id=abc');
    expect(parseQuery(params)).toEqual(EMPTY_QUERY);
  });

  it('trims and limits the name', () => {
    expect(parseQuery(new URLSearchParams({ name: '  Frisk  ' })).name).toBe('Frisk');
    expect(parseQuery(new URLSearchParams({ name: 'a'.repeat(30) })).name).toHaveLength(15);
  });

  it('keeps a story fight in the url and counts it as a search', () => {
    const query = { ...EMPTY_QUERY, fight: '12', mode: 'STORY' as const };
    expect(parseQuery(toParams(query))).toEqual(query);
    expect(hasQuery({ ...EMPTY_QUERY, fight: '12' })).toBe(true);
    expect(parseQuery(new URLSearchParams('fight=abc')).fight).toBe('');
  });

  it('counts a mode or soul alone as a search', () => {
    expect(hasQuery({ ...EMPTY_QUERY, mode: 'CUSTOM' })).toBe(true);
    expect(hasQuery({ ...EMPTY_QUERY, soul: 'PATIENCE' })).toBe(true);
  });

  it('searches a story fight in the story mode', () => {
    expect(parseQuery(fightParams('12'))).toEqual({ ...EMPTY_QUERY, fight: '12', mode: 'STORY' });
  });

  it('searches a player by id and keeps their name for the form', () => {
    const query = parseQuery(playerParams({ id: 42, name: 'Frisk' }));
    expect(query).toEqual({ ...EMPTY_QUERY, id: '42', name: 'Frisk' });
  });
});

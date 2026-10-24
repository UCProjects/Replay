import { describe, expect, it } from 'vitest';
import {
  MAX_STORED,
  loadStored,
  pruneStored,
  saveStored,
} from './recordStore';

function memory() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => { values.delete(key); },
    setItem: (key: string, value: string) => { values.set(key, value); },
    size: () => values.size,
  };
}

describe('recordStore', () => {
  it('gives back what was saved, and nothing for a game it has not seen', () => {
    const storage = memory();
    expect(saveStored('a', '{"x":1}', storage)).toBe(true);
    expect(loadStored('a', storage)).toBe('{"x":1}');
    expect(loadStored('b', storage)).toBeUndefined();
  });

  it('replaces a game saved twice without keeping two', () => {
    const storage = memory();
    saveStored('a', '1', storage);
    saveStored('a', '2', storage);
    expect(loadStored('a', storage)).toBe('2');
    expect(storage.size()).toBe(2);
  });

  it('drops the oldest games past the limit', () => {
    const storage = memory();
    for (let i = 0; i <= MAX_STORED; i += 1) saveStored(`g${i}`, `${i}`, storage);
    expect(loadStored('g0', storage)).toBeUndefined();
    expect(loadStored('g1', storage)).toBe('1');
    expect(loadStored(`g${MAX_STORED}`, storage)).toBe(`${MAX_STORED}`);
  });

  it('keeps a game that was saved again ahead of older ones', () => {
    const storage = memory();
    for (let i = 0; i < MAX_STORED; i += 1) saveStored(`g${i}`, `${i}`, storage);
    saveStored('g0', 'again', storage);
    saveStored('new', 'new', storage);
    expect(loadStored('g0', storage)).toBe('again');
    expect(loadStored('g1', storage)).toBeUndefined();
  });

  it('forgets games that are no longer wanted', () => {
    const storage = memory();
    ['a', 'b', 'c'].forEach((key) => saveStored(key, key, storage));
    expect(pruneStored(['b'], storage)).toBe(true);
    expect(loadStored('a', storage)).toBeUndefined();
    expect(loadStored('b', storage)).toBe('b');
    expect(loadStored('c', storage)).toBeUndefined();
  });

  it('copes with storage that throws', () => {
    const broken = {
      getItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    };
    expect(saveStored('a', '1', broken)).toBe(false);
    expect(loadStored('a', broken)).toBeUndefined();
    expect(pruneStored([], broken)).toBe(false);
  });
});

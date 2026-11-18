import { describe, expect, it } from 'vitest';
import { booleanSetting } from './settings';

function memory() {
  const values: Record<string, string> = {};
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => { values[key] = value; },
  };
}

const blocked = () => {
  throw new Error('blocked');
};

describe('booleanSetting', () => {
  it('uses the fallback until something is saved', () => {
    const store = memory();
    expect(booleanSetting('a', true, () => store).get()).toBe(true);
    expect(booleanSetting('b', false, () => store).get()).toBe(false);
  });

  it('reads back what was saved', () => {
    const store = memory();
    const setting = booleanSetting('a', true, () => store);
    expect(setting.set(false)).toBe(true);
    expect(setting.get()).toBe(false);
    setting.set(true);
    expect(setting.get()).toBe(true);
  });

  it('falls back when storage is blocked', () => {
    const setting = booleanSetting('a', true, blocked);
    expect(setting.get()).toBe(true);
    expect(setting.set(false)).toBe(false);
  });
});

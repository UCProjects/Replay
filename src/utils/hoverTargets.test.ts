import { describe, expect, it } from 'vitest';
import { nextTargets, toggleTargets } from './hoverTargets';

type Target = { depth: number; element: string };
const t = (depth: number, element: string): Target => ({ depth, element });

describe('nextTargets', () => {
  it('opens a first preview from the page', () => {
    expect(nextTargets<Target>([], -1, { element: 'a' })).toEqual([t(0, 'a')]);
  });

  it('replaces the preview at the same depth', () => {
    expect(nextTargets([t(0, 'a')], -1, { element: 'b' })).toEqual([t(0, 'b')]);
  });

  it('opens a preview from text inside another one and keeps the first', () => {
    expect(nextTargets([t(0, 'a')], 0, { element: 'b' })).toEqual([t(0, 'a'), t(1, 'b')]);
  });

  it('closes the deeper previews when the pointer is back on a shallower one', () => {
    expect(nextTargets([t(0, 'a'), t(1, 'b')], 0, null)).toEqual([t(0, 'a')]);
  });

  it('keeps everything while the pointer is on the deepest one', () => {
    const old = [t(0, 'a'), t(1, 'b')];
    expect(nextTargets(old, 1, null)).toBe(old);
  });
});

describe('toggleTargets', () => {
  it('opens one and closes it on the next tap', () => {
    const open = toggleTargets<Target>([], -1, { element: 'a' });
    expect(open).toEqual([t(0, 'a')]);
    expect(toggleTargets(open, -1, { element: 'a' })).toEqual([]);
  });

  it('closes the deeper ones when tapping inside a shallower one', () => {
    expect(toggleTargets([t(0, 'a'), t(1, 'b')], 0, null)).toEqual([t(0, 'a')]);
  });
});

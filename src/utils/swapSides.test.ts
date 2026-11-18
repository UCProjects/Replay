import { describe, expect, it } from 'vitest';
import { swapIndex, swapSides } from './swapSides';

describe('swapSides', () => {
  it('moves the second four slots in front of the first four', () => {
    expect(swapSides([0, 1, 2, 3, 4, 5, 6, 7])).toEqual([4, 5, 6, 7, 0, 1, 2, 3]);
  });

  it('does not change the original list', () => {
    const items = [0, 1, 2, 3, 4, 5, 6, 7];
    swapSides(items);
    expect(items).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });
});

describe('swapIndex', () => {
  it('maps a slot to the same position on the other side', () => {
    expect([0, 3, 4, 7].map(swapIndex)).toEqual([4, 7, 0, 3]);
  });
});

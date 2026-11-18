import { describe, expect, it } from 'vitest';
import { legacySlots } from './legacySlots';

type Scene = { action: string; extra?: unknown; slots?: unknown };

const OPPONENT = 10;
const SELF = 20;
const flame = { name: 'TheFlame', enchantType: 'NEGATIVE', duration: -1 };

const update = (id: number, enchant?: unknown): Scene => ({
  action: 'unknown',
  extra: { event: 'getUpdateSlot', data: { slot: { id, enchant } } },
});
const effect = (
  playerId: number,
  slotId: number,
  affecteds: number[],
  affectedSlots?: number[],
): Scene => ({
  action: 'unknown',
  extra: {
    event: 'getEnchantDoingEffect',
    data: {
      playerId, slotId, affecteds, affectedSlots,
    },
  },
});
const read = (extra: unknown) => extra;
const run = (scenes: Scene[]) => legacySlots(scenes, read, OPPONENT, SELF);

describe('legacySlots', () => {
  it('leaves a recording alone when it already has slots or has no slot events', () => {
    const withSlots = [{ action: 'update', slots: [] }, update(100000, flame)];
    expect(run(withSlots)).toBe(withSlots);
    const plain = [{ action: 'monster' }, { action: 'unknown', extra: { event: 'getPlayJingle' } }];
    expect(run(plain)).toBe(plain);
  });

  it('turns slot updates into update scenes that carry the slots so far', () => {
    const [first, second, third] = run([update(100002, flame), { action: 'monster' }, update(100002)]);
    expect(first.action).toBe('update');
    expect(first.slots).toEqual([null, null, flame, null, null, null, null, null]);
    expect(second.slots).toEqual(first.slots);
    expect(third.slots).toBeUndefined();
  });

  it('puts the enemy group on the top row and yours on the bottom by default', () => {
    const [top, bottom] = run([update(100001, flame), update(100005, flame)]);
    expect((top.slots as unknown[])[1]).toEqual(flame);
    expect((bottom.slots as unknown[])[5]).toEqual(flame);
  });

  it('learns which group belongs to which player from an enchant effect', () => {
    const [, swapped] = run([effect(SELF, 100002, []), update(100002, flame)]);
    expect((swapped.slots as unknown[])[6]).toEqual(flame);
  });

  it('turns an enchant effect into the scene the recorder now makes', () => {
    const [, scene] = run([update(100002, flame), effect(OPPONENT, 100002, [7, 8], [100003])]);
    expect(scene.action).toBe('enchantEffect');
    expect(scene.extra).toEqual({
      trigger: 2,
      affected: { cards: [{ id: 7 }, { id: 8 }], slots: [3] },
    });
  });

  it('ignores a slot id that is not one of the eight', () => {
    const [scene] = run([update(5, flame)]);
    expect(scene.slots).toBeUndefined();
  });
});

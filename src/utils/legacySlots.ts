import { EnchantSlot } from '~/types/game';

type Scene = {
  action: string;
  extra?: unknown;
  slots?: unknown;
};

type SlotEvent = {
  event?: string;
  data?: {
    affectedSlots?: number[];
    affecteds?: number[];
    playerId?: number;
    slot?: { enchant?: EnchantSlot; id?: number };
    slotId?: number;
  };
};

const FIRST_SLOT = 100000;
const SIDE = 4;
const SLOTS = 8;

function slotEventOf(scene: Scene, read: (extra: unknown) => unknown): SlotEvent | null {
  if (scene.action !== 'unknown') return null;
  const found = read(scene.extra) as SlotEvent | null;
  return found?.event === 'getUpdateSlot' || found?.event === 'getEnchantDoingEffect' ? found : null;
}

function ownersOf(events: (SlotEvent | null)[], opponent: number, self: number): [number, number] {
  const owners: [number | undefined, number | undefined] = [undefined, undefined];
  events.forEach((found) => {
    const { playerId, slotId } = found?.data ?? {};
    if (found?.event !== 'getEnchantDoingEffect' || playerId === undefined || slotId === undefined) return;
    const side = Math.floor((slotId - FIRST_SLOT) / SIDE);
    if (side === 0 || side === 1) owners[side] = playerId;
  });
  const other = (id: number) => (id === opponent ? self : opponent);
  const first = owners[0] ?? (owners[1] === undefined ? opponent : other(owners[1]));
  const second = owners[1] ?? other(first);
  return [first, second];
}

export function legacySlots<T extends Scene>(
  scenes: T[],
  read: (extra: unknown) => unknown,
  opponent: number,
  self: number,
): T[] {
  if (scenes.some((scene) => scene.slots)) return scenes;
  const events = scenes.map((scene) => slotEventOf(scene, read));
  if (!events.some(Boolean)) return scenes;

  const owners = ownersOf(events, opponent, self);
  const indexOf = (id: number | undefined): number | undefined => {
    if (id === undefined) return undefined;
    const offset = id - FIRST_SLOT;
    if (offset < 0 || offset >= SIDE * 2) return undefined;
    const owner = owners[Math.floor(offset / SIDE)];
    return (owner === opponent ? 0 : SIDE) + (offset % SIDE);
  };
  const positions = (ids: number[] = []) => ids.flatMap((id) => {
    const index = indexOf(id);
    return index === undefined ? [] : [index];
  });

  let current: EnchantSlot[] = Array.from({ length: SLOTS }, () => null);
  return scenes.map((scene, i) => {
    const found = events[i];
    const data = found?.data;
    let next: T = scene;

    if (found?.event === 'getUpdateSlot') {
      const index = indexOf(data?.slot?.id);
      if (index !== undefined) {
        current = current.map((slot, at) => (at === index ? data?.slot?.enchant ?? null : slot));
      }
      next = { ...scene, action: 'update' } as T;
    } else if (found?.event === 'getEnchantDoingEffect') {
      next = {
        ...scene,
        action: 'enchantEffect',
        extra: {
          trigger: indexOf(data?.slotId),
          affected: {
            cards: (data?.affecteds ?? []).map((id) => ({ id })),
            slots: positions(data?.affectedSlots),
          },
        },
      };
    }

    return current.some(Boolean) ? { ...next, slots: current } as T : next;
  });
}

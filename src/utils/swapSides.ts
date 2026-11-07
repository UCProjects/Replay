const SIDE = 4;
const SLOTS = SIDE * 2;

export function swapIndex(index: number): number {
  return (index + SIDE) % SLOTS;
}

export function swapSides<T>(items: T[]): T[] {
  return [...items.slice(SIDE), ...items.slice(0, SIDE)];
}

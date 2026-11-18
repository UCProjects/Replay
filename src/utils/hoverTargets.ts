export type Layered = {
  depth: number;
};

export function popperDepth(node: EventTarget | null): number {
  if (!(node instanceof Element)) return -1;
  const found = node.closest('[data-preview-depth]');
  const depth = Number(found?.getAttribute('data-preview-depth'));
  return found && Number.isInteger(depth) ? depth : -1;
}

export function nextTargets<T extends Layered>(
  old: T[],
  inside: number,
  found: Omit<T, 'depth'> | null,
): T[] {
  const kept = old.filter((target) => target.depth <= inside);
  if (!found) return kept.length === old.length ? old : kept;
  return [...kept, { ...found, depth: inside + 1 } as T];
}

export function toggleTargets<T extends Layered & { element: unknown }>(
  old: T[],
  inside: number,
  found: Omit<T, 'depth'> | null,
): T[] {
  if (!found) return nextTargets(old, inside, null);
  const { element } = found as { element: unknown };
  const open = old.some((target) => target.depth === inside + 1 && target.element === element);
  return open
    ? old.filter((target) => target.depth <= inside)
    : nextTargets(old, inside, found);
}

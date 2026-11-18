export type RecordStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>;

const INDEX_KEY = 'replay.records';
const ITEM_PREFIX = 'replay.record.';

export const MAX_STORED = 100;

function readIndex(storage: RecordStorage): string[] {
  try {
    const index: unknown = JSON.parse(storage.getItem(INDEX_KEY) ?? '[]');
    return Array.isArray(index) ? index.filter((key): key is string => typeof key === 'string') : [];
  } catch {
    return [];
  }
}

function drop(storage: RecordStorage, key: string): boolean {
  try {
    storage.removeItem(`${ITEM_PREFIX}${key}`);
    return true;
  } catch {
    return false;
  }
}

export function loadStored(key: string, storage: RecordStorage = localStorage): string | undefined {
  try {
    return storage.getItem(`${ITEM_PREFIX}${key}`) ?? undefined;
  } catch {
    return undefined;
  }
}

export function saveStored(
  key: string,
  json: string,
  storage: RecordStorage = localStorage,
): boolean {
  try {
    const index = readIndex(storage).filter((stored) => stored !== key);
    index.push(key);
    while (index.length > MAX_STORED) drop(storage, index.shift()!);
    storage.setItem(`${ITEM_PREFIX}${key}`, json);
    storage.setItem(INDEX_KEY, JSON.stringify(index));
    return true;
  } catch {
    return false;
  }
}

export function pruneStored(keep: string[], storage: RecordStorage = localStorage): boolean {
  try {
    const kept = new Set(keep);
    const index = readIndex(storage);
    index.filter((key) => !kept.has(key)).forEach((key) => drop(storage, key));
    storage.setItem(INDEX_KEY, JSON.stringify(index.filter((key) => kept.has(key))));
    return true;
  } catch {
    return false;
  }
}

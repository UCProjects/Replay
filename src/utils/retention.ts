import { GameRecord } from '~/structures/GameRecord';

const DAY_MS = 24 * 60 * 60 * 1000;

export const RETENTION_DAYS = 30;

export function isOldKept(
  { date, key, kept }: Pick<GameRecord, 'date' | 'key' | 'kept'>,
  favorites: string[],
  now = Date.now(),
): boolean {
  return kept
    && date.getTime() < now - RETENTION_DAYS * DAY_MS
    && !favorites.includes(key);
}

export function daysSince(date: Date, now = Date.now()): number {
  return Math.floor((now - date.getTime()) / DAY_MS);
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const RETENTION_DAYS = 30;
export const GRACE_DAYS = 1;
export const COOLDOWN_DAYS = 1;
export const FREE_FAVORITES = 5;
export const PRO_FAVORITES = 20;

const RETENTION_MS = RETENTION_DAYS * DAY_MS;
const GRACE_MS = GRACE_DAYS * DAY_MS;

export function expiresSoonAfterUnfavorite(date: Date, now = Date.now()): boolean {
  return date.getTime() + RETENTION_MS <= now + GRACE_MS;
}

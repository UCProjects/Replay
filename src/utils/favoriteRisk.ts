const DAY_MS = 24 * 60 * 60 * 1000;
const RETENTION_MS = 30 * DAY_MS;
const GRACE_MS = DAY_MS;

export function expiresSoonAfterUnfavorite(date: Date, now = Date.now()): boolean {
  return date.getTime() + RETENTION_MS <= now + GRACE_MS;
}

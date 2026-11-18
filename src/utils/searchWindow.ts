const DAY_MS = 24 * 60 * 60 * 1000;

export const GUEST_DAYS = 1;
export const MEMBER_DAYS = 7;
export const PRO_DAYS = 30;

export type SearchWindowClaims = Record<string, unknown>;

function isPro({ admin, pro }: SearchWindowClaims, now: number): boolean {
  if (admin === true || pro === true) return true;
  return typeof pro === 'number' && pro >= now;
}

export function searchWindowDays(claims: SearchWindowClaims | null, now = Date.now()): number {
  if (!claims) return GUEST_DAYS;
  return isPro(claims, now) ? PRO_DAYS : MEMBER_DAYS;
}

export function searchWindowStart(days: number, now = Date.now()): Date {
  return new Date(now - days * DAY_MS);
}

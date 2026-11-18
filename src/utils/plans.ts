export type Plan = {
  amount: number;
  currency: string;
  maxSlots?: number;
  months?: number;
  price: number;
  sale?: { amount: number; until: number };
  slots?: number;
};

export type Plans = Record<string, Plan>;

export type ProStatus = { kind: 'none' } | { kind: 'forever' } | { kind: 'until'; until: Date };

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

function parsePlan(value: unknown): Plan | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const {
    amount, currency, maxSlots, months, price, sale, slots,
  } = value as Record<string, unknown>;
  if (!isCount(amount) || !isCount(price) || typeof currency !== 'string') return undefined;
  if (!isCount(months) && !isCount(slots)) return undefined;
  const plan: Plan = { amount, currency, price };
  if (isCount(months)) plan.months = months;
  if (isCount(slots)) plan.slots = slots;
  if (isCount(maxSlots)) plan.maxSlots = maxSlots;
  const { amount: saleAmount, until } = (sale ?? {}) as Record<string, unknown>;
  if (isCount(saleAmount) && typeof until === 'number') plan.sale = { amount: saleAmount, until };
  return plan;
}

export function parsePlans(value: unknown): Plans {
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(Object.entries(value)
    .map(([name, plan]) => [name, parsePlan(plan)] as const)
    .filter((entry): entry is [string, Plan] => entry[1] !== undefined));
}

export function slotsFull(plan: Plan, owned: number): boolean {
  if (plan.slots === undefined || plan.maxSlots === undefined) return false;
  return owned + plan.slots > plan.maxSlots;
}

export function proStatus(claim: unknown, now = Date.now()): ProStatus {
  if (claim === true) return { kind: 'forever' };
  if (typeof claim === 'number' && claim >= now) return { kind: 'until', until: new Date(claim) };
  return { kind: 'none' };
}

function count(amount: number, one: string, many: string): string {
  return `${amount} ${amount === 1 ? one : many}`;
}

export function planTitle(plan: Plan): string {
  if (plan.months) return `Pro for ${count(plan.months, 'month', 'months')}`;
  return count(plan.slots ?? 0, 'favorite slot', 'favorite slots');
}

export function formatPrice(amount: number, currency: string): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export type Wallet = Record<string, number>;

export function parseWallet(data: unknown): Wallet {
  if (!data || typeof data !== 'object') return {};
  return Object.fromEntries(Object.entries(data)
    .filter((entry): entry is [string, number] => typeof entry[1] === 'number' && Number.isFinite(entry[1])));
}

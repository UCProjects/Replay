import { describe, expect, it } from 'vitest';
import { parseWallet } from './wallet';

describe('parseWallet', () => {
  it('keeps only numeric balances', () => {
    expect(parseWallet({
      FMC: 120, other: 3, name: 'x', updated: { seconds: 1 }, broken: NaN,
    })).toEqual({ FMC: 120, other: 3 });
  });

  it('gives an empty wallet for a missing doc', () => {
    expect(parseWallet(undefined)).toEqual({});
    expect(parseWallet(null)).toEqual({});
  });
});

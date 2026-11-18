import { describe, expect, it } from 'vitest';
import {
  formatPrice, parsePlans, planTitle, proStatus, slotsFull,
} from './plans';

describe('parsePlans', () => {
  it('keeps well-formed plans and their sale', () => {
    const plans = parsePlans({
      month: {
        amount: 100, currency: 'FMC', months: 1, price: 80, sale: { amount: 80, until: 5 },
      },
      slot: {
        amount: 25, currency: 'FMC', maxSlots: 20, price: 25, slots: 1,
      },
    });
    expect(plans).toEqual({
      month: {
        amount: 100, currency: 'FMC', months: 1, price: 80, sale: { amount: 80, until: 5 },
      },
      slot: {
        amount: 25, currency: 'FMC', maxSlots: 20, price: 25, slots: 1,
      },
    });
  });

  it('drops plans that are missing a price, currency or what they grant', () => {
    expect(parsePlans({
      noPrice: { amount: 1, currency: 'FMC', months: 1 },
      noCurrency: { amount: 1, price: 1, months: 1 },
      nothing: { amount: 1, currency: 'FMC', price: 1 },
      bad: 'x',
    })).toEqual({});
    expect(parsePlans(null)).toEqual({});
  });

  it('ignores a malformed sale', () => {
    expect(parsePlans({
      month: {
        amount: 100, currency: 'FMC', months: 1, price: 100, sale: { amount: 'x' },
      },
    }).month.sale).toBeUndefined();
  });
});

describe('slotsFull', () => {
  const slot = {
    amount: 25, currency: 'FMC', maxSlots: 20, price: 25, slots: 1,
  };

  it('is full once another slot would pass the cap', () => {
    expect(slotsFull(slot, 19)).toBe(false);
    expect(slotsFull(slot, 20)).toBe(true);
  });

  it('is never full without a cap or for time plans', () => {
    expect(slotsFull({ ...slot, maxSlots: undefined }, 99)).toBe(false);
    expect(slotsFull({
      amount: 100, currency: 'FMC', maxSlots: 1, months: 1, price: 100,
    }, 99)).toBe(false);
  });
});

describe('proStatus', () => {
  it('reads the pro claim', () => {
    expect(proStatus(true, 10)).toEqual({ kind: 'forever' });
    expect(proStatus(20, 10)).toEqual({ kind: 'until', until: new Date(20) });
    expect(proStatus(5, 10)).toEqual({ kind: 'none' });
    expect(proStatus(undefined, 10)).toEqual({ kind: 'none' });
    expect(proStatus('yes', 10)).toEqual({ kind: 'none' });
  });
});

describe('planTitle', () => {
  it('names month and slot plans', () => {
    expect(planTitle({
      amount: 1, currency: 'FMC', months: 1, price: 1,
    })).toBe('Pro for 1 month');
    expect(planTitle({
      amount: 1, currency: 'FMC', months: 3, price: 1,
    })).toBe('Pro for 3 months');
    expect(planTitle({
      amount: 1, currency: 'FMC', price: 1, slots: 1,
    })).toBe('1 favorite slot');
  });
});

describe('formatPrice', () => {
  it('puts the currency after the amount', () => {
    expect(formatPrice(25, 'FMC')).toBe('25 FMC');
  });
});

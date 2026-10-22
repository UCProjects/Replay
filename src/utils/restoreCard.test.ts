import { describe, expect, it } from 'vitest';
import { Family } from '~/types/card';
import { restoreCard, StoredCard } from './restoreCard';

const stored = (extra: Record<string, unknown> = {}): StoredCard => ({
  id: 891,
  name: 'Grand Prize',
  image: 'Grand_Prize',
  ...extra,
}) as StoredCard;

describe('restoreCard', () => {
  it('puts back what the stored file leaves out', () => {
    expect(restoreCard(stored())).toMatchObject({
      extension: Family.UT,
      fixedId: 891,
      rarity: 'COMMON',
      shiny: false,
    });
  });

  it('keeps what the stored file does say', () => {
    const card = restoreCard(stored({ rarity: 'TOKEN', extension: Family.DR }));
    expect(card.rarity).toBe('TOKEN');
    expect(card.extension).toBe(Family.DR);
  });

  it('makes max health equal to health so the card is not shown as damaged', () => {
    expect(restoreCard(stored({ hp: 3 }))).toMatchObject({ hp: 3, maxHp: 3 });
    expect(restoreCard(stored({ hp: 1, maxHp: 4 }))).toMatchObject({ maxHp: 4 });
  });

  it('treats the printed values as the original ones so no stat looks changed', () => {
    const card = restoreCard(stored({ cost: 2, attack: 3, hp: 4 }));
    expect(card).toMatchObject({ originalCost: 2, originalAttack: 3, originalHp: 4 });
  });

  it('keeps an original value the stored file does give', () => {
    expect(restoreCard(stored({ cost: 2, originalCost: 5 })).originalCost).toBe(5);
  });

  it('has no original cost of its own for a free card', () => {
    expect(restoreCard(stored()).originalCost).toBe(0);
  });

  it('adds no health to a spell', () => {
    expect('maxHp' in restoreCard(stored())).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { Card, CardType, Family } from '~/types/card';
import { cardClasses, soulOf } from './cardClasses';

const card = (extra: Record<string, unknown> = {}): Card => ({
  id: 1,
  fixedId: 100,
  name: 'Tiny Froggit',
  image: 'Tiny_Froggit',
  rarity: 'COMMON',
  extension: Family.UT,
  shiny: false,
  ...extra,
}) as Card;

describe('cardClasses', () => {
  it('has none for an empty slot or a plain card', () => {
    expect(cardClasses(null)).toEqual([]);
    expect(cardClasses(card({ hp: 3, maxHp: 3 }))).toEqual([]);
  });

  it('marks a shiny card', () => {
    expect(cardClasses(card({ shiny: true }))).toEqual(['card-shiny']);
  });

  it('marks a spell, and does not call it damaged', () => {
    expect(cardClasses(card({ typeCard: CardType.SPELL, hp: 1, maxHp: 4 }))).toEqual(['card-spell']);
  });

  it('marks a monster that has lost health, counting a missing hp as zero', () => {
    expect(cardClasses(card({ hp: 2, maxHp: 4 }))).toEqual(['card-damaged']);
    expect(cardClasses(card({ maxHp: 4 }))).toEqual(['card-damaged']);
  });

  it('can be shiny and damaged at once', () => {
    expect(cardClasses(card({ shiny: true, hp: 1, maxHp: 2 }))).toEqual(['card-shiny', 'card-damaged']);
  });
});

describe('soulOf', () => {
  it('reads the soul a spell belongs to', () => {
    expect(soulOf(card({ soul: { id: 7, name: 'PERSEVERANCE' } }))).toBe('PERSEVERANCE');
  });

  it('has none for a card without one', () => {
    expect(soulOf(card())).toBeUndefined();
    expect(soulOf(null)).toBeUndefined();
  });
});

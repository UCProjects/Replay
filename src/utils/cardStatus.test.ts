import { describe, expect, it } from 'vitest';
import { Card, CardType, Family } from '~/types/card';
import { statusIcons, toKebabCase } from './cardStatus';

type Extra = Record<string, unknown>;

const monster = (extra: Extra = {}): Card => ({
  id: 1,
  fixedId: 100,
  name: 'Tiny Froggit',
  image: 'Tiny_Froggit',
  rarity: 'COMMON',
  extension: Family.UT,
  shiny: false,
  ...extra,
}) as Card;

const spell = (extra: Extra = {}): Card => monster({
  typeCard: CardType.SPELL,
  ...extra,
});

const names = (card: Card) => statusIcons(card).map(({ image }) => image);

describe('toKebabCase', () => {
  it('splits capitals and digits like the game does', () => {
    expect(toKebabCase('Taunt')).toBe('taunt');
    expect(toKebabCase('FloweryPower')).toBe('flowery-power');
    expect(toKebabCase('BaseStatChange')).toBe('base-stat-change');
    expect(toKebabCase('MoldSpore')).toBe('mold-spore');
  });
});

describe('statusIcons', () => {
  it('shows nothing for a plain card', () => {
    expect(statusIcons(monster({
      cost: 2,
      originalCost: 2,
      attack: 1,
      originalAttack: 1,
    }))).toEqual([]);
  });

  it('treats the fields the recorder drops when they are zero as zero', () => {
    expect(names(monster({ originalCost: 2 }))).toEqual(['BonusCost']);
    expect(names(monster({ cost: 3 }))).toEqual(['MalusCost']);
    expect(names(monster({ originalAttack: 3 }))).toEqual(['MalusAtk']);
    expect(names(monster({ attack: 2 }))).toEqual(['BonusAtk']);
    expect(names(monster({ maxHp: 4 }))).toEqual(['BonusHp']);
    expect(names(monster({ originalHp: 4 }))).toEqual(['MalusHp']);
  });

  it('says what the stat used to be', () => {
    const [icon] = statusIcons(monster({ cost: 1, originalCost: 3 }));
    expect(icon).toEqual({
      args: [3],
      counter: 0,
      image: 'BonusCost',
      key: 'status-cost-debuff',
    });
  });

  it('only looks at attack and health on monsters', () => {
    expect(names(spell({ attack: 5, maxHp: 5 }))).toEqual([]);
  });

  it('shows the Determination icon on determination cards', () => {
    expect(names(monster({ rarity: 'DETERMINATION' }))).toEqual(['Determination']);
  });

  it('turns each status into an icon and shows its counter only when the game says so', () => {
    const icons = statusIcons(monster({
      statuses: [
        {
          name: 'Taunt', statusType: 'POSITIVE', statusBehavior: 'UNIQUE', counter: 1,
        },
        {
          name: 'Paralyzed', statusType: 'NEGATIVE', statusBehavior: 'UNIQUE', counter: 2, displayCounter: true,
        },
        {
          name: 'FloweryPower', statusType: 'POSITIVE', statusBehavior: 'STACKABLE', counter: 3, displayCounter: true,
        },
      ],
    }));
    expect(icons).toEqual([
      {
        args: [0], counter: 0, image: 'Taunt', key: 'status-taunt',
      },
      {
        args: [2], counter: 2, image: 'Paralyzed', key: 'status-paralyzed',
      },
      {
        args: [3], counter: 3, image: 'FloweryPower', key: 'status-flowery-power',
      },
    ]);
  });

  it('keeps the order of the game: cost, determination, stats, statuses, created', () => {
    expect(names(monster({
      cost: 1,
      originalCost: 3,
      rarity: 'DETERMINATION',
      attack: 4,
      originalAttack: 2,
      statuses: [{ name: 'Haste', statusType: 'POSITIVE', statusBehavior: 'UNIQUE' }],
      creatorInfo: { id: 7 },
    }))).toEqual(['BonusCost', 'Determination', 'BonusAtk', 'Haste', 'Created']);
  });

  it('shows a generated card as created, counting a missing creator type as a card', () => {
    const [card] = statusIcons(monster({ creatorInfo: { id: 550 } }));
    expect(card.args).toEqual([{ macro: '{{CARD:550|1}}' }]);

    const [artifact] = statusIcons(monster({ creatorInfo: { typeCreator: 1, id: 80 } }));
    expect(artifact.args).toEqual([{ macro: '{{ARTIFACT:80}}' }]);

    const [soul] = statusIcons(monster({ creatorInfo: { typeCreator: 2, name: 'KINDNESS' } }));
    expect(soul.args).toEqual([{ macro: '{{SOUL:KINDNESS}}' }]);

    const [enchant] = statusIcons(monster({ creatorInfo: { typeCreator: 3, name: 'TheFlame' } }));
    expect(enchant.args).toEqual([{ macro: '{{ENCHANT:the-flame}}' }]);
  });

  it('does not call a card created when the creator type says it was not', () => {
    expect(names(monster({ creatorInfo: { typeCreator: -1 } }))).toEqual([]);
  });

  it('shows a caught monster with its owner', () => {
    const [box] = statusIcons(
      monster({ caughtMonster: { fixedId: 12, ownerId: 9 } }),
      (id) => (id === 9 ? 'Frisk' : undefined),
    );
    expect(box).toEqual({
      args: [{ macro: '{{CARD:12|1}}' }, 'Frisk'],
      counter: 0,
      image: 'Box',
      key: 'status-caught',
    });
  });

  it('marks the 2024 event card', () => {
    expect(names(monster({ fixedId: 874 }))).toEqual(['Underevent2024']);
  });
});

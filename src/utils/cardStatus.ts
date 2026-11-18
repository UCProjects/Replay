import { Card, CreatorInfo, CreatorType } from '~/types/card';
import { isMonster } from '~/utils/isCard';

export type StatusArg = number | string | { macro: string };

export type StatusIcon = {
  args: StatusArg[];
  counter: number;
  image: string;
  key: string;
};

const UNDEREVENT_2024 = 874;

export function toKebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function creatorMacro({ id, name, typeCreator }: CreatorInfo): string {
  switch (typeCreator ?? CreatorType.CARD) {
    case CreatorType.ARTIFACT: return `{{ARTIFACT:${id}}}`;
    case CreatorType.SOUL: return `{{SOUL:${name}}}`;
    case CreatorType.ENCHANT: return `{{ENCHANT:${toKebabCase(name ?? '')}}}`;
    default: return `{{CARD:${id}|1}}`;
  }
}

export function statusIcons(
  card: Card,
  ownerName: (ownerId: number) => string | undefined = () => undefined,
): StatusIcon[] {
  const icons: StatusIcon[] = [];
  const add = (
    image: string,
    key: string,
    args: StatusArg[] = [],
    counter = 0,
  ) => icons.push({
    args,
    counter,
    image,
    key,
  });

  const cost = card.cost ?? 0;
  const originalCost = card.originalCost ?? 0;
  if (cost < originalCost) add('BonusCost', 'status-cost-debuff', [originalCost]);
  if (cost > originalCost) add('MalusCost', 'status-cost-buff', [originalCost]);

  if (card.rarity === 'DETERMINATION') add('Determination', 'status-determination');

  if (isMonster(card)) {
    const attack = card.attack ?? 0;
    const originalAttack = card.originalAttack ?? 0;
    if (attack > originalAttack) add('BonusAtk', 'status-atk-buff', [originalAttack]);
    if (attack < originalAttack) add('MalusAtk', 'status-atk-debuff', [originalAttack]);

    const maxHp = card.maxHp ?? 0;
    const originalHp = card.originalHp ?? 0;
    if (maxHp > originalHp) add('BonusHp', 'status-hp-buff', [originalHp]);
    if (maxHp < originalHp) add('MalusHp', 'status-hp-debuff', [originalHp]);

    const { caughtMonster } = card;
    if (caughtMonster) {
      add('Box', 'status-caught', [
        { macro: `{{CARD:${caughtMonster.fixedId}|1}}` },
        ownerName(caughtMonster.ownerId ?? 0) ?? '',
      ]);
    }

    if (card.fixedId === UNDEREVENT_2024) add('Underevent2024', 'status-underevent-2024');
  }

  (card.statuses ?? []).forEach((status) => {
    const counter = status.displayCounter ? status.counter ?? 0 : 0;
    add(status.name, `status-${toKebabCase(status.name)}`, [counter], counter);
  });

  const { creatorInfo } = card;
  const creatorType: number = creatorInfo?.typeCreator ?? CreatorType.CARD;
  if (creatorInfo && creatorType >= 0) {
    add('Created', 'status-created', [{ macro: creatorMacro(creatorInfo) }]);
  }

  return icons;
}

import { Card } from '~/types/card';
import { isMonster, isSpell } from '~/utils/isCard';

type WithSoul = { soul?: { name?: string } };

export function soulOf(card: Card | null): string | undefined {
  return (card as WithSoul | null)?.soul?.name;
}

export function cardClasses(card: Card | null): string[] {
  if (!card) return [];

  const classes: string[] = [];
  if (card.shiny) classes.push('card-shiny');
  if (isSpell(card)) {
    classes.push('card-spell');
  } else if (isMonster(card) && (card.hp ?? 0) < (card.maxHp ?? 0)) {
    classes.push('card-damaged');
  }
  return classes;
}

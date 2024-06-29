import {
  Card,
  CardType,
  Monster,
  Spell,
} from '~/types/card';

export function isMonster(card: Card): card is Monster {
  return card.type !== CardType.SPELL;
}

export function isSpell(card: Card): card is Spell {
  return card.type === CardType.SPELL;
}

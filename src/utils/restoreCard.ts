import { Card, Family } from '~/types/card';

export type StoredCard = Omit<Card, 'extension' | 'fixedId' | 'rarity' | 'shiny'>
& Partial<Pick<Card, 'extension' | 'fixedId' | 'rarity' | 'shiny'>>
& {
  attack?: number;
  hp?: number;
  maxHp?: number;
  originalAttack?: number;
  originalHp?: number;
};

export function restoreCard(stored: StoredCard): Card {
  const { attack, hp } = stored;
  return {
    ...stored,
    extension: stored.extension ?? Family.UT,
    fixedId: stored.fixedId ?? stored.id,
    originalCost: stored.originalCost ?? stored.cost ?? 0,
    rarity: stored.rarity ?? 'COMMON',
    shiny: stored.shiny ?? false,
    ...(attack === undefined ? {} : { originalAttack: stored.originalAttack ?? attack }),
    ...(hp === undefined ? {} : {
      maxHp: stored.maxHp ?? hp,
      originalHp: stored.originalHp ?? hp,
    }),
  } as Card;
}

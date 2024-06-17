import { Soul } from './soul';

export enum CardType {
  MONSTER,
  SPELL,
}

export type Rarity = 'GENERATED' | 'BASE' | 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'DETERMINATION' | 'TOKEN';

export enum Family {
  UT = 'BASE',
  DR = 'DELTARUNE',
  UTY = 'UTY',
}

export enum CreatorType {
  CARD,
  ARTIFACT,
  SOUL,
}

export type CreatorInfo<Type extends CreatorType = CreatorType.CARD> = {
  typeCreator: Type;
  id: Type extends CreatorType.SOUL ? never : number;
  name: Type extends CreatorType.SOUL ? string : never;
};

export type CardInfo = {
  loop?: number;
  creatorInfo?: CreatorInfo;
};

export type MonsterInfo = CardInfo & {
  hp: number;
  maxHp: number;
  attack: number;
  originalAttack: number;
  taunt?: boolean;
  charge?: boolean;
  haste?: boolean;
  paralyzed?: boolean;
  candy?: boolean;
  kr?: boolean;
  armor?: number;
  dodge?: number;
  burn?: number;
  cantAttack?: boolean;
  anotherChance?: boolean;
  invulnerable?: boolean;
  transparency?: boolean;
  silence?: boolean;
  ranged?: boolean;
  thorns?: boolean;
  // eslint-disable-next-line no-use-before-define -- One has to exist before the other...
  caughtMonster?: Card;
  shockEnabled?: boolean;
  supportEnabled?: boolean;
  bullseyeEnabled?: boolean;
  ex_defending?: boolean;
};

export type Card<Type extends CardType = CardType.MONSTER> = (
  Type extends CardType.MONSTER ? MonsterInfo : CardInfo
) & {
  id: number;
  type: Type;
  name: string;
  image: string;
  rarity: Rarity;
  extension: Family;
  cost: number;
  shiny: boolean;
  tribes?: string[];
  soul: Type extends CardType.SPELL ? Soul : never;
};

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
  ENCHANT,
}

export type CreatorInfo = {
  typeCreator?: CreatorType | -1;
  id?: number;
  name?: string;
};

export type CardStatus = {
  name: string;
  statusType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  statusBehavior: 'REPLACE' | 'STACKABLE' | 'UNIQUE';
  counter?: number;
  displayCounter?: boolean;
};

export type MonsterInfo = {
  hp?: number;
  maxHp?: number;
  originalHp?: number;
  attack?: number;
  originalAttack?: number;
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
  caughtMonster?: Card & { ownerId?: number };
  shockEnabled?: boolean;
  supportEnabled?: boolean;
  bullseyeEnabled?: boolean;
  ex_defending?: boolean;
};

export type Card = {
  id: number;
  fixedId: number;
  typeCard?: CardType;
  name: string;
  image: string;
  rarity: Rarity;
  extension: Family;
  cost?: number;
  originalCost?: number;
  shiny: boolean;
  statuses?: CardStatus[];
  tribes?: string[];
  loop?: number;
  creatorInfo?: CreatorInfo;
};

export type Monster = Card & MonsterInfo;
export type Spell = Card & {
  soul: Soul;
}

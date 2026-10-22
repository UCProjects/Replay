export type AnimationTarget = 'MONSTER' | 'PLAYER';

export type StatKind = 'attack' | 'cost' | 'hp';

export type AnimationEffect =
  | {
    color: string;
    id: number;
    kind: 'stat';
    stat: StatKind;
    target: AnimationTarget;
    text: string;
  }
  | {
    id: number;
    kind: 'heal';
    target: AnimationTarget;
  }
  | {
    duration: number;
    id: number;
    image: string;
    kind: 'flash';
  }
  | {
    duration: number;
    kind: 'barrier';
  }
  | {
    duration: number;
    kind: 'spell';
  };

export const EFFECT_DURATION = {
  heal: { MONSTER: 600, PLAYER: 820 },
  stat: 750,
} as const;

const FLASHES: Record<string, { duration: number; image: string }> = {
  ATTACK_BUFF: { duration: 870, image: 'AttackBuff' },
  ATTACK_DEBUFF: { duration: 810, image: 'AttackDebuff' },
  HP_BUFF: { duration: 870, image: 'HpBuff' },
  FREEZE: { duration: 1200, image: 'Ice' },
  HP_DEBUFF: { duration: 810, image: 'HpDebuff' },
  POISON: { duration: 800, image: 'Poison' },
  SILENCE: { duration: 1680, image: 'Silence' },
};

const BOARD_WIDE = {
  BARRIER_BREAK: { duration: 3550, kind: 'barrier' },
  SPELL: { duration: 1150, kind: 'spell' },
} as const;

const STATS: Record<string, StatKind> = {
  ATTACK_STAT: 'attack',
  COST_STAT: 'cost',
  HP_STAT: 'hp',
};

export function statColor(stat: StatKind, value: number): string {
  const gain = value >= 0;
  switch (stat) {
    case 'attack': return gain ? '#f00000' : '#c600d3';
    case 'cost': return gain ? 'darkcyan' : '#00fff7';
    default: return gain ? 'rgb(13, 208, 0)' : '#ffd400';
  }
}

type Payload = {
  animation?: string;
  idTarget?: number;
  target?: string;
  value?: number;
};

export function describeAnimation(extra: unknown): AnimationEffect | null {
  if (!extra || typeof extra !== 'object') return null;
  const {
    animation,
    idTarget,
    target,
    value = 0,
  } = extra as Payload;
  if (typeof animation === 'string' && animation in BOARD_WIDE) {
    return { ...BOARD_WIDE[animation as keyof typeof BOARD_WIDE] };
  }
  if (typeof animation !== 'string' || typeof idTarget !== 'number') return null;
  if (target !== 'MONSTER' && target !== 'PLAYER') return null;

  if (animation === 'HEAL') return { id: idTarget, kind: 'heal', target };

  const flash = FLASHES[animation];
  if (flash) {
    return target === 'MONSTER' ? { ...flash, id: idTarget, kind: 'flash' } : null;
  }

  const stat = STATS[animation];
  if (!stat) return null;
  if (target === 'PLAYER' && stat !== 'hp') return null;
  return {
    color: statColor(stat, value),
    id: idTarget,
    kind: 'stat',
    stat,
    target,
    text: `${value >= 0 ? '+' : ''}${value}`,
  };
}

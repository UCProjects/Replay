export type Soul = keyof typeof SOUL;

export const SOUL = {
  BRAVERY: 'Bravery',
  DETERMINATION: 'Determination',
  INTEGRITY: 'Integrity',
  JUSTICE: 'Justice',
  KINDNESS: 'Kindness',
  PATIENCE: 'Patience',
  PERSEVERANCE: 'Perseverance',
  MONSTER: 'Monster', // Legacy
} as const;

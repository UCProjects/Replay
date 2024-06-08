export const SOUL = {
  Bravery = 'BRAVERY',
  Determination = 'DETERMINATION',
  Integrity = 'INTEGRITY',
  Justice = 'JUSTICE',
  Kindness = 'KINDNESS',
  Patience = 'PATIENCE',
  Perseverance = 'PERSEVERANCE',
  Monster = 'MONSTER', // Legacy
} as const;

export type Soul = typeof SOUL[keyof typeof SOUL];

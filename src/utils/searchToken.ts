import { Soul } from '~/types/soul';

export type SearchTokenParams = {
  id?: string;
  name?: string;
  soul?: 'ANY' | Soul;
};

export function searchToken({
  id = '0',
  name = '',
  soul = 'ANY',
}: SearchTokenParams = {}): string | undefined {
  const number = Number(id);
  let player: string | undefined;
  if (id !== '0' && Number.isInteger(number)) {
    player = `i:${number}`;
  } else if (name) {
    player = `n:${name.toLowerCase()}`;
  }

  const soulKey = soul === 'ANY' ? undefined : `s:${soul}`;
  if (player && soulKey) return `${player}|${soulKey}`;
  return player ?? soulKey;
}

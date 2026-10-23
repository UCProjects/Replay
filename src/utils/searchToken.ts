import { Soul } from '~/types/soul';

export type SearchTokenParams = {
  fight?: string;
  id?: string;
  name?: string;
  soul?: 'ANY' | Soul;
};

export function searchToken({
  fight = '',
  id = '0',
  name = '',
  soul = 'ANY',
}: SearchTokenParams = {}): string | undefined {
  if (/^\d+$/.test(fight)) return `n:story-fight-${fight}-name`;

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

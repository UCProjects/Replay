import { GameMode, MODE } from '~/types/game';
import { SOUL, Soul } from '~/types/soul';

export type SearchQuery = {
  fight: string;
  id: string;
  mode: GameMode;
  name: string;
  soul: 'ANY' | Soul;
};

export const STORY_FIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 10000] as const;

export const EMPTY_QUERY: SearchQuery = {
  fight: '',
  id: '',
  mode: 'ANY',
  name: '',
  soul: 'ANY',
};

export const MAX_NAME_LENGTH = 15;

export function parseQuery(params: URLSearchParams): SearchQuery {
  const id = params.get('id') ?? '';
  const fight = params.get('fight') ?? '';
  const mode = params.get('mode') ?? '';
  const soul = params.get('soul') ?? '';
  return {
    fight: /^\d+$/.test(fight) ? fight : '',
    id: /^\d+$/.test(id) ? id : '',
    mode: mode in MODE ? mode as GameMode : 'ANY',
    name: (params.get('name') ?? '').trim().slice(0, MAX_NAME_LENGTH),
    soul: soul in SOUL ? soul as Soul : 'ANY',
  };
}

export function hasQuery({
  fight,
  id,
  mode,
  name,
  soul,
}: SearchQuery): boolean {
  return Boolean(fight || id || name || mode !== 'ANY' || soul !== 'ANY');
}

export function toParams(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.fight) params.set('fight', query.fight);
  if (query.name.trim()) params.set('name', query.name.trim().slice(0, MAX_NAME_LENGTH));
  if (query.id) params.set('id', query.id);
  if (query.mode !== 'ANY') params.set('mode', query.mode);
  if (query.soul !== 'ANY') params.set('soul', query.soul);
  return params;
}

export function fightParams(fight: string): URLSearchParams {
  return toParams({
    ...EMPTY_QUERY,
    fight,
    mode: 'STORY',
  });
}

export function playerParams({ id, name }: { id: number; name: string }): URLSearchParams {
  return toParams({
    ...EMPTY_QUERY,
    id: `${id}`,
    name,
  });
}

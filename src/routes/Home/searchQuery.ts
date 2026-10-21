import { GameMode, MODE } from '~/types/game';
import { SOUL, Soul } from '~/types/soul';

export type SearchQuery = {
  id: string;
  mode: GameMode;
  name: string;
  soul: 'ANY' | Soul;
};

export const EMPTY_QUERY: SearchQuery = {
  id: '',
  mode: 'ANY',
  name: '',
  soul: 'ANY',
};

export const MAX_NAME_LENGTH = 15;

export function parseQuery(params: URLSearchParams): SearchQuery {
  const id = params.get('id') ?? '';
  const mode = params.get('mode') ?? '';
  const soul = params.get('soul') ?? '';
  return {
    id: /^\d+$/.test(id) ? id : '',
    mode: mode in MODE ? mode as GameMode : 'ANY',
    name: (params.get('name') ?? '').trim().slice(0, MAX_NAME_LENGTH),
    soul: soul in SOUL ? soul as Soul : 'ANY',
  };
}

export function hasQuery({
  id,
  mode,
  name,
  soul,
}: SearchQuery): boolean {
  return Boolean(id || name || mode !== 'ANY' || soul !== 'ANY');
}

export function toParams(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.name.trim()) params.set('name', query.name.trim().slice(0, MAX_NAME_LENGTH));
  if (query.id) params.set('id', query.id);
  if (query.mode !== 'ANY') params.set('mode', query.mode);
  if (query.soul !== 'ANY') params.set('soul', query.soul);
  return params;
}

export function playerParams({ id, name }: { id: number; name: string }): URLSearchParams {
  return toParams({
    ...EMPTY_QUERY,
    id: `${id}`,
    name,
  });
}

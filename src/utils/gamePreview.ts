import { User } from '~/types/user';

export type GamePreview = {
  date?: Date;
  ids?: Tuple<User['id'], 2>;
  names?: Tuple<User['name'], 2>;
  type?: string;
};

type Valid = (item: unknown) => boolean;

function parsePair<T>(value: string | undefined, valid: Valid): Tuple<T, 2> | undefined {
  if (!value) return undefined;
  try {
    const pair: unknown = JSON.parse(value);
    const ok = Array.isArray(pair) && pair.length === 2 && pair.every(valid);
    return ok ? pair as Tuple<T, 2> : undefined;
  } catch {
    return undefined;
  }
}

function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const time = Number(value);
  return Number.isFinite(time) ? new Date(time) : undefined;
}

export function parsePreview(custom: Record<string, string> | undefined): GamePreview {
  return {
    date: parseDate(custom?.date),
    ids: parsePair<User['id']>(custom?.ids, (id) => typeof id === 'number'),
    names: parsePair<User['name']>(custom?.names, (name) => typeof name === 'string'),
    type: custom?.type || undefined,
  };
}

export function matchup(
  { ids, names }: GamePreview,
  watched?: number,
): Tuple<string, 2> | undefined {
  if (!names) return undefined;
  const [opponent, player] = names;
  return watched !== undefined && ids?.[0] === watched ? [opponent, player] : [player, opponent];
}

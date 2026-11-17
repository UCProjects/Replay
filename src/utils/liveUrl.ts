import { User } from '~/types/user';

const SPECTATE = 'https://undercards.net/Spectate';

export function liveUrl(
  gameId: number | undefined,
  ids: Tuple<User['id'], 2> | undefined,
  watched?: number,
): string | undefined {
  if (!gameId) return undefined;
  const params = new URLSearchParams({ gameId: `${gameId}` });
  const player = watched !== undefined && ids?.includes(watched) ? watched : ids?.[1];
  if (player !== undefined) params.set('playerId', `${player}`);
  return `${SPECTATE}?${params.toString()}`;
}

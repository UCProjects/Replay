import {
  LoaderFunctionArgs,
} from 'react-router-dom';
import { currentFavorites } from '~/managers/favorites';
import load from '~/managers/game';
import { loadAllCards } from '~/managers/cards';
import { loadLanguage } from '~/managers/lang';
import { get } from '~/managers/search';
import { GameRecord } from '~/structures/GameRecord';
import { isOldKept } from '~/utils/retention';

export const WATCH_PARAM = 'watch';

export type GateData = { gate: GameRecord };

export default async function GameLoader({
  params: {
    id,
  },
  request,
}: LoaderFunctionArgs): Promise<any> {
  if (!id) throw new Error('Failed to find game');

  if (!new URL(request.url).searchParams.has(WATCH_PARAM)) {
    const record = await get(id);
    const favorites = await currentFavorites().catch(() => []);
    if (isOldKept(record, favorites)) return { gate: record } satisfies GateData;
  }

  const game = await load(id);
  return Promise.all([
    game,
    loadLanguage(game.translation),
    loadAllCards(game.cards).catch((error) => console.error('Card previews unavailable', error)),
  ]);
}

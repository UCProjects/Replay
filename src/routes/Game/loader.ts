import { FirebaseError } from 'firebase/app';
import {
  LoaderFunctionArgs,
} from 'react-router-dom';
import load, { gamePreview } from '~/managers/game';
import { loadAllCards } from '~/managers/cards';
import { loadLanguage } from '~/managers/lang';
import { get } from '~/managers/search';
import { GamePreview } from '~/utils/gamePreview';

export type GateData = { gate: { id: string, preview: GamePreview } };

async function gateOf(id: string): Promise<GateData | undefined> {
  try {
    await get(id);
    return undefined;
  } catch (error) {
    if (!(error instanceof FirebaseError) || error.code !== 'permission-denied') throw error;
    const preview = await gamePreview(id);
    if (!preview) throw Error(`[${id}] Game not found`);
    return { gate: { id, preview } };
  }
}

export default async function GameLoader({
  params: {
    id,
  },
  request,
}: LoaderFunctionArgs): Promise<any> {
  if (!id) throw new Error('Failed to find game');

  const gate = await gateOf(id);
  if (gate) return gate;

  const user = new URL(request.url).searchParams.get('user');
  const game = await load(id, user === null ? undefined : Number(user));
  return Promise.all([
    game,
    loadLanguage(game.translation),
    loadAllCards(game.cards).catch((error) => console.error('Card previews unavailable', error)),
  ]);
}

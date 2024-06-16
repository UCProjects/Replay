import {
  LoaderFunctionArgs,
} from 'react-router-dom';
import load from '~/managers/game';
import { loadLanguage } from '~/managers/lang';

export default async function GameLoader({
  params: {
    id,
    step,
  },
  // request,
}: LoaderFunctionArgs): Promise<any> {
  if (!id) throw new Error('Failed to find game');
  const game = await load(id);
  return Promise.all([
    game,
    step,
    loadLanguage(game.translation),
    // loadAllCards(game.cards)
  ]);
}

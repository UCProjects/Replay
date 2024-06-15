import search from '~/managers/search';
import { GameRecord, GameRecords } from '~/structures/GameRecord';

export const history: GameRecord[] = [];

export default async function searchRecent(): Promise<GameRecords> {
  const results = await search({
    previous: history[0]?.date,
  });

  history.unshift(...results);

  return [...history];
}

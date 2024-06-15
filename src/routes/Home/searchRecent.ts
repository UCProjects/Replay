import { hasLoaded, loadLanguage } from '~/managers/lang';
import search from '~/managers/search';
import { GameRecord, GameRecords } from '~/structures/GameRecord';

const history: GameRecord[] = [];

export default async function searchRecent(): Promise<GameRecords> {
  const results = await search({
    previous: history[0]?.date,
  });

  history.unshift(...results);

  // TODO: Can I get away without this?
  if (history.length && !hasLoaded()) {
    await loadLanguage(history[0].translation);
  }

  return [...history];
}

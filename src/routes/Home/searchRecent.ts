import { hasLoaded, loadLanguage } from '~/managers/lang';
import search from '~/managers/search';
import { GameRecord, GameRecords } from '~/structures/GameRecord';

const history: GameRecord[] = [];

export default async function searchRecent(): Promise<GameRecords> {
  const results = await search({
    previous: history[0]?.date,
  });

  const records: GameRecord[] = [];
  results.forEach((record) => records.push(record.data()));
  history.unshift(...records);

  // TODO: Can I get away without this?
  if (history.length && !hasLoaded()) {
    await loadLanguage(history[0].translation);
  }

  return [...history];
}

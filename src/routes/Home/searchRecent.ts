import { QueryDocumentSnapshot } from 'firebase/firestore';
import search from '../../managers/search';
import { GameRecord, GameRecords } from '../../structures/GameRecord';
import { hasLoaded, loadLanguage } from '../../managers/lang';

const history: GameRecord[] = [];
let last: QueryDocumentSnapshot<GameRecord>;

export default async function searchRecent(): Promise<GameRecords> {
  const results = await search({
    previous: last,
  });

  const records: GameRecord[] = [];
  results.forEach((record) => records.push(record.data()));
  history.unshift(...records);

  // TODO: Can I get away without this?
  if (history.length && !hasLoaded()) {
    await loadLanguage(history[0].translation);
  }

  return history;
}

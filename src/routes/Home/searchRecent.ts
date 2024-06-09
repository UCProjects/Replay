import { QueryDocumentSnapshot } from 'firebase/firestore';
import search from '../../managers/search';
import { GameRecord, GameRecords } from '../../structures/GameRecord';

const history: QueryDocumentSnapshot<GameRecord>[] = [];

function getHistory(): GameRecords {
  return history.map((snap) => snap.data());
}

export default async function searchRecent(): Promise<GameRecords> {
  const results = await search({
    previous: history[0],
  });
  history.unshift(...results.docs);
  // TODO: load default translation

  return getHistory();
}

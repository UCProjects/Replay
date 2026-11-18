import search from '~/managers/search';
import { GameRecord, GameRecords } from '~/structures/GameRecord';

const MAX_HISTORY = 100;
const MAX_BATCHES = 10;

export const history: GameRecord[] = [];

export function cachedRecent(): GameRecords {
  return [...history];
}

export default async function searchRecent(limit = 20): Promise<GameRecords> {
  let more = true;
  for (let batch = 0; more && batch < MAX_BATCHES; batch += 1) {
    const previous = history[0]?.date;
    // eslint-disable-next-line no-await-in-loop
    const results = await search({
      limit,
      newer: Boolean(previous),
      previous,
    });
    history.unshift(...results);
    more = Boolean(previous) && results.length >= limit;
  }

  history.length = Math.min(history.length, MAX_HISTORY);

  return [...history];
}

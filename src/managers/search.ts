import {
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  limitToLast,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { converter, GameRecord } from '~/structures/GameRecord';
import { MODE, GameMode } from '~/types/game';
import { Soul } from '~/types/soul';
import { searchToken } from '~/utils/searchToken';
import firebase from './firebase';

export type SearchParams = {
  fight?: string;
  id?: string;
  limit?: number;
  mode?: GameMode;
  name?: string;
  newer?: boolean;
  soul?: 'ANY' | Soul;
  previous?: Date;
};

const cache = new Map<GameRecord['key'], GameRecord>();

const db = getFirestore(firebase);

export default async function search({
  fight = '',
  id = '0',
  limit: lmt = 20,
  mode = 'ANY',
  name = '',
  newer = false,
  soul = 'ANY',
  previous = undefined,
}: SearchParams = {}): Promise<GameRecord[]> {
  const date = new Date();
  date.setDate(date.getDate() - 6);

  const constraints: QueryConstraint[] = [
    where('date', '>=', date),
    orderBy('date', 'desc'),
  ];

  const token = searchToken({
    fight,
    id,
    name,
    soul,
  });
  if (token) {
    constraints.push(where('search', 'array-contains', token));
  }

  if (mode !== 'ANY' && MODE[mode]) {
    constraints.push(where('type', '==', mode));
  }

  if (previous) {
    constraints.push(endBefore(previous));
  }

  const q = query(
    collection(db, 'gamehistory'),
    ...constraints,
    newer ? limitToLast(lmt) : limit(lmt),
  ).withConverter(converter);
  const docs = await getDocs(q);

  const records: GameRecord[] = [];
  docs.forEach((result) => {
    records.push(store(result.data()));
  });
  return records;
}

export async function get(key: GameRecord['key']): Promise<GameRecord> {
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  const ref = doc(db, 'gamehistory', key)
    .withConverter(converter);
  const result = await getDoc(ref);

  if (!result.exists()) {
    throw Error(`[${key}] Game not found`);
  }

  return store(result.data());
}

function store(data: GameRecord) {
  cache.set(data.key, data);
  return data;
}

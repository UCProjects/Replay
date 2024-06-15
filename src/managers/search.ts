import {
  collection,
  doc,
  endBefore,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { converter, GameRecord } from '~/structures/GameRecord';
import { MODE, GameMode } from '~/types/game';
import { SOUL, Soul } from '~/types/soul';
import firebase from './firebase';

export type SearchParams = {
  id?: string;
  mode?: GameMode;
  name?: string;
  soul?: 'ANY' | Soul;
  previous?: Date;
};

const cache = new Map<GameRecord['key'], GameRecord>();

const db = getFirestore(firebase);

export default async function search({
  id = '0',
  mode = 'ANY',
  name = '',
  soul = 'ANY',
  previous = undefined,
}: SearchParams = {}): Promise<GameRecord[]> {
  const date = new Date();
  // date.setDate(date.getDate() - 1); // FIXME: Supposed to allow 7 days

  const constraints: QueryConstraint[] = [
    where('date', '>=', date),
    orderBy('date', 'desc'),
  ];

  if (id !== '0') {
    const number = Number(id);
    if (Number.isInteger(number)) {
      constraints.push(where('playermeta.ids', 'array-contains', number));
    }
  } else if (name) {
    constraints.push(where('playermeta.names', 'array-contains', name));
  }

  if (mode !== 'ANY' && MODE[mode]) {
    constraints.push(where('type', '==', mode));
  }

  if (soul !== 'ANY' && SOUL[soul]) {
    constraints.push(where('playermeta.souls', 'array-contains', soul));
  }

  if (previous) {
    constraints.push(endBefore(previous));
  }

  const q = query(
    collection(db, 'gamehistory'),
    ...constraints,
    // TODO: custom limit depending on guest, sponsor, admin
    limit(20),
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
    return Promise.resolve(cached);
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

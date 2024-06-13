import {
  collection,
  DocumentSnapshot,
  endBefore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { converter, GameRecord } from '~/structures/GameRecord';
import { MODE, GameMode } from '~/types/game';
import { SOUL, Soul } from '~/types/soul';
import firebase from './firebase';

export type Snapshot = DocumentSnapshot<GameRecord>;

const db = getFirestore(firebase);

export type SearchParams = {
  id?: string;
  mode?: GameMode;
  name?: string;
  soul?: 'ANY' | Soul;
  previous?: Snapshot;
};

export default function search({
  id = '0',
  mode = 'ANY',
  name = '',
  soul = 'ANY',
  previous = undefined,
}: SearchParams = {}): Promise<QuerySnapshot<GameRecord>> {
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

  return getDocs(q);
}

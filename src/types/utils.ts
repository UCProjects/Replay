import { DocumentSnapshot } from 'firebase/firestore';

export type Tuple<T, N extends number, A extends any[] = []> =
  A extends { length: N } ? A : Tuple<T, N, [...A, T]>;

export type DocumentKey = DocumentSnapshot['id'];

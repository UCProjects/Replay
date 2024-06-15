import { DocumentSnapshot } from 'firebase/firestore';

declare global {
  type Modify<T, R> = Omit<T, keyof R> & R;

  type Tuple<T, N extends number, A extends any[] = []> =
    A extends { length: N } ? A : Tuple<T, N, [...A, T]>;

  type Optional<T extends any[], O> = [...T, O?];

  type DocumentKey = DocumentSnapshot['id'];
}

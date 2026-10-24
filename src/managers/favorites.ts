import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import app from './firebase';

type FavoriteRequest = {
  favorite: boolean;
  game: string;
};

type FavoriteResponse = {
  games: string[];
};

const EMULATOR_PORT = 5001;

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

if (import.meta.env.VITE_FUNCTIONS_EMULATOR) {
  connectFunctionsEmulator(functions, 'localhost', EMULATOR_PORT);
}

const call = httpsCallable<FavoriteRequest, FavoriteResponse>(functions, 'spectate-favorite');

const cache = new Map<string, string[]>();

export async function fetchFavorites(uid: string): Promise<string[]> {
  const cached = cache.get(uid);
  if (cached) return cached;
  const snapshot = await getDoc(doc(db, 'favorites', uid));
  const games = (snapshot.get('games') as string[] | undefined) ?? [];
  cache.set(uid, games);
  return games;
}

export async function currentFavorites(): Promise<string[]> {
  await auth.authStateReady();
  return auth.currentUser ? fetchFavorites(auth.currentUser.uid) : [];
}

export async function setFavorite(uid: string, game: string, favorite: boolean): Promise<string[]> {
  const { data } = await call({ favorite, game });
  cache.set(uid, data.games);
  return data.games;
}

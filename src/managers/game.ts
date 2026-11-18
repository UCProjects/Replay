import { FirebaseError } from 'firebase/app';
import {
  getBlob,
  getMetadata,
  getStorage,
  ref,
} from 'firebase/storage';
import { LoadedGame, loadGame } from '~/structures/LoadedGame';
import { GameRaw } from '~/types/game';
import { GamePreview, parsePreview } from '~/utils/gamePreview';
import app from './firebase';
import { get } from './search';

const cache = new Map<DocumentKey, GameRaw>();

const storage = getStorage(app);

export default async function load(key: DocumentKey, watched?: number): Promise<LoadedGame> {
  const cached = loadCached(key);
  if (cached) {
    const record = await get(key);
    return loadGame(record, cached, watched);
  }

  const [record, data] = await Promise.all([get(key), getRaw(key)]);
  store(key, data);
  return loadGame(record, data, watched);
}

export async function gamePreview(key: DocumentKey): Promise<GamePreview | undefined> {
  try {
    const { customMetadata } = await getMetadata(ref(storage, `game/${key}`));
    return parsePreview(customMetadata);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'storage/object-not-found') return undefined;
    throw error;
  }
}

async function getRaw(key: DocumentKey): Promise<GameRaw> {
  const cached = loadCached(key);
  if (cached) {
    return cached;
  }
  const blob = await getBlob(ref(storage, `game/${key}`));
  const text = await blob.text();
  return JSON.parse(text) as GameRaw;
}

function loadCached(key: DocumentKey) {
  const data = cache.get(key);
  if (data) {
    cache.delete(key);
    store(key, data);
  }
  return data;
}

function store(key: DocumentKey, data: GameRaw) {
  cache.set(key, data);
  const i = [...cache.keys()];
  while (cache.size > 20) {
    cache.delete(i.pop()!);
  }
}

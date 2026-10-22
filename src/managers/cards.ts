import { getBlob, getStorage, ref } from 'firebase/storage';
import { Card } from '~/types/card';
import { restoreCard, StoredCard } from '~/utils/restoreCard';
import firebase from './firebase';

const storage = getStorage(firebase);
const cache = new Map<DocumentKey, Map<number, Card>>();
let current = new Map<number, Card>();

export async function loadAllCards(key: DocumentKey): Promise<Map<number, Card>> {
  const cached = cache.get(key);
  if (cached) {
    current = cached;
    return cached;
  }
  const blob = await getBlob(ref(storage, `cards/${key}`));
  const stored = JSON.parse(await blob.text()) as StoredCard[];
  const cards = new Map(stored.map((card) => [card.id, restoreCard(card)]));
  cache.set(key, cards);
  current = cards;
  return cards;
}

export function getCard(id: number): Card | undefined {
  return current.get(id);
}

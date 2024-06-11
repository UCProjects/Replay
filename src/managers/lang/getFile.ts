import { getBlob, getStorage, ref } from 'firebase/storage';
import firebase from '../firebase';

const storage = getStorage(firebase);

const path = ref(storage, 'lang');

export default async function getFile(key: DocumentKey): Promise<Record<string, string>> {
  const blob = await getBlob(ref(path, key));
  const text = await blob.text();
  return JSON.parse(text) as Record<string, string>;
}

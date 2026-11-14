import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import {
  Plans, ProStatus, parsePlans, proStatus,
} from '~/utils/plans';
import app from './firebase';
import functions from './functions';

const PLANS_URL = '/plans';

export type Account = {
  pro: ProStatus;
  slots: number;
};

const auth = getAuth(app);
const db = getFirestore(app);

const buyCall = httpsCallable<{ plan: string }, { plan: string; pro?: number; slots?: number }>(functions, 'spectate-buy');
const voucherCall = httpsCallable<{ plan: string }, { code: string }>(functions, 'spectate-buyVoucher');
const redeemCall = httpsCallable<{ code: string }, { pro: number }>(functions, 'spectate-redeemVoucher');

export async function fetchPlans(): Promise<Plans> {
  const response = await fetch(PLANS_URL);
  if (!response.ok) throw new Error(`Could not load prices (${response.status})`);
  return parsePlans(await response.json());
}

export async function fetchAccount(): Promise<Account | null> {
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return null;
  const [{ claims }, favorites] = await Promise.all([
    user.getIdTokenResult(),
    getDoc(doc(db, 'favorites', user.uid)),
  ]);
  const slots: unknown = favorites.get('slots');
  return {
    pro: proStatus(claims.pro),
    slots: Number.isSafeInteger(slots) && (slots as number) > 0 ? slots as number : 0,
  };
}

async function refreshClaims(): Promise<void> {
  await auth.currentUser?.getIdToken(true);
}

export async function buy(plan: string): Promise<void> {
  await buyCall({ plan });
  await refreshClaims();
}

export async function buyVoucher(plan: string): Promise<string> {
  const { data } = await voucherCall({ plan });
  return data.code;
}

export async function redeemVoucher(code: string): Promise<void> {
  await redeemCall({ code });
  await refreshClaims();
}

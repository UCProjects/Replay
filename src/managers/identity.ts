import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { exchangeToken } from '~/utils/exchangeToken';
import app from './firebase';

export type LoginMethod = 'discord' | 'github' | 'google';

export const identityConfig = {
  apiKey: 'AIzaSyCy97vTRXkj33Eif5SYJds_RfpI1tY-Kec',
  appId: '1:995842639655:web:6e54f793c6a24ecbeecb02',
  authDomain: 'auth.feildmaster.com',
  projectId: 'feildbase',
};

export const loginAvailable = Boolean(identityConfig.apiKey && identityConfig.appId);

const PROVIDERS: Record<LoginMethod, () => AuthProvider> = {
  discord: () => new OAuthProvider('oidc.discord'),
  github: () => new GithubAuthProvider(),
  google: () => new GoogleAuthProvider(),
};

let identity: FirebaseApp | undefined;

function identityApp(): FirebaseApp {
  identity ??= initializeApp(identityConfig, 'identity');
  return identity;
}

export async function login(method: LoginMethod): Promise<void> {
  if (!loginAvailable) throw new Error('Sign in is not set up');
  const identityAuth = getAuth(identityApp());
  try {
    const { user } = await signInWithPopup(identityAuth, PROVIDERS[method]());
    const token = await exchangeToken(await user.getIdToken());
    await signInWithCustomToken(getAuth(app), token);
  } finally {
    await signOut(identityAuth);
  }
}

export function logout(): Promise<void> {
  return signOut(getAuth(app));
}

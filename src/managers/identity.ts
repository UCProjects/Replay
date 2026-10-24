import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  getAuth,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { awaitDiscordToken } from '~/utils/discordPopup';
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

const POPUP_FEATURES = 'height=800,width=400';

const PROVIDERS: Record<Exclude<LoginMethod, 'discord'>, () => AuthProvider> = {
  github: () => new GithubAuthProvider(),
  google: () => new GoogleAuthProvider(),
};

let identity: FirebaseApp | undefined;

function identityApp(): FirebaseApp {
  identity ??= initializeApp(identityConfig, 'identity');
  return identity;
}

function discordCredential(identityAuth: Auth): Promise<UserCredential> {
  const origin = `https://${identityConfig.authDomain}`;
  const popup = window.open(
    `${origin}/discord?origin=${encodeURIComponent(window.location.origin)}`,
    'auth',
    POPUP_FEATURES,
  );
  if (!popup) return Promise.reject(new Error('Allow popups to sign in with Discord'));
  return awaitDiscordToken(popup, origin)
    .then((token) => signInWithCustomToken(identityAuth, token));
}

export async function login(method: LoginMethod): Promise<void> {
  if (!loginAvailable) throw new Error('Sign in is not set up');
  const identityAuth = getAuth(identityApp());
  try {
    const { user } = await (method === 'discord'
      ? discordCredential(identityAuth)
      : signInWithPopup(identityAuth, PROVIDERS[method]()));
    const token = await exchangeToken(await user.getIdToken());
    await signInWithCustomToken(getAuth(app), token);
  } finally {
    await signOut(identityAuth);
  }
}

export function logout(): Promise<void> {
  return signOut(getAuth(app));
}

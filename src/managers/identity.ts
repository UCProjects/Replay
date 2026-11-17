import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  User,
  UserCredential,
  getAuth,
  linkWithPopup,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { isAuthorizedHost } from '~/utils/authorizedDomain';
import { awaitDiscordLink, awaitDiscordToken } from '~/utils/discordPopup';
import { exchangeToken } from '~/utils/exchangeToken';
import { Wallet, parseWallet } from '~/utils/wallet';
import app from './firebase';

export type LoginMethod = 'discord' | 'github' | 'google';

export type LinkedAccounts = Record<LoginMethod, boolean>;

export const identityConfig = {
  apiKey: 'AIzaSyCy97vTRXkj33Eif5SYJds_RfpI1tY-Kec',
  appId: '1:995842639655:web:6e54f793c6a24ecbeecb02',
  authDomain: 'auth.feildmaster.com',
  projectId: 'feildbase',
};

export const loginAvailable = Boolean(identityConfig.apiKey && identityConfig.appId);

const PROJECT_CONFIG = `https://identitytoolkit.googleapis.com/v1/projects?key=${identityConfig.apiKey}`;

let domainCheck: Promise<boolean> | undefined;

export function domainAuthorized(): Promise<boolean> {
  domainCheck ??= fetch(PROJECT_CONFIG)
    .then((response) => (response.ok ? response.json() : null) as Promise<unknown>)
    .then((body) => {
      const domains = (body as { authorizedDomains?: unknown } | null)?.authorizedDomains;
      if (!Array.isArray(domains)) return true;
      const names = domains.filter((domain): domain is string => typeof domain === 'string');
      return isAuthorizedHost(window.location.hostname, names);
    })
    .catch(() => true);
  return domainCheck;
}

const AUTH_ORIGIN = `https://${identityConfig.authDomain}`;
const POPUP_FEATURES = 'height=800,width=400';
const DISCORD_CLAIM = 'discord.com';

const PROVIDERS: Record<Exclude<LoginMethod, 'discord'>, () => AuthProvider> = {
  github: () => new GithubAuthProvider(),
  google: () => new GoogleAuthProvider(),
};

const PROVIDER_IDS: Record<Exclude<LoginMethod, 'discord'>, string> = {
  github: 'github.com',
  google: 'google.com',
};

let identity: FirebaseApp | undefined;

function identityApp(): FirebaseApp {
  identity ??= initializeApp(identityConfig, 'identity');
  return identity;
}

function discordPopup(query: Record<string, string>): Window {
  const popup = window.open(
    `${AUTH_ORIGIN}/discord?${new URLSearchParams({ origin: window.location.origin, ...query }).toString()}`,
    'auth',
    POPUP_FEATURES,
  );
  if (!popup) throw new Error('Allow popups to continue with Discord');
  return popup;
}

function discordCredential(identityAuth: Auth): Promise<UserCredential> {
  return awaitDiscordToken(discordPopup({}), AUTH_ORIGIN)
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
  } catch (error) {
    await signOut(identityAuth);
    throw error;
  }
}

export async function logout(): Promise<void> {
  await Promise.all([
    signOut(getAuth(app)),
    signOut(getAuth(identityApp())),
  ]);
}

async function identityUser(): Promise<User | null> {
  const identityAuth = getAuth(identityApp());
  await identityAuth.authStateReady();
  const user = identityAuth.currentUser;
  const replayUid = getAuth(app).currentUser?.uid;
  return user && replayUid && user.uid === replayUid ? user : null;
}

export function watchWallet(onChange: (wallet: Wallet | null) => void): () => void {
  const watch: { active: boolean; stop?: () => void } = { active: true };
  identityUser()
    .then((user) => {
      if (!watch.active) return;
      if (!user) {
        onChange(null);
        return;
      }
      watch.stop = onSnapshot(
        doc(getFirestore(identityApp()), 'wallet', user.uid),
        (snapshot) => onChange(parseWallet(snapshot.data())),
        () => onChange(null),
      );
    })
    .catch(() => onChange(null));
  return () => {
    watch.active = false;
    watch.stop?.();
  };
}

export async function identityName(): Promise<string | null> {
  const user = await identityUser();
  if (!user) return null;
  await user.reload();
  return user.displayName;
}

export async function linkedAccounts(): Promise<LinkedAccounts | null> {
  const user = await identityUser();
  if (!user) return null;
  const { claims } = await user.getIdTokenResult();
  const ids = user.providerData.map(({ providerId }) => providerId);
  return {
    discord: claims[DISCORD_CLAIM] === true,
    github: ids.includes(PROVIDER_IDS.github),
    google: ids.includes(PROVIDER_IDS.google),
  };
}

async function linkDiscord(user: User): Promise<void> {
  const nonce = crypto.randomUUID();
  const link = await awaitDiscordLink(discordPopup({ mode: 'link', nonce }), AUTH_ORIGIN, nonce);
  const { data } = await httpsCallable(getFunctions(identityApp()), 'auth-discord-token')(link);
  if (data !== 'LINKED') throw new Error('Could not link Discord');
  await user.getIdToken(true);
}

export async function linkAccount(method: LoginMethod): Promise<void> {
  const user = await identityUser();
  if (!user) throw new Error('Sign in again to link accounts');
  if (method === 'discord') {
    await linkDiscord(user);
    return;
  }
  await linkWithPopup(user, PROVIDERS[method]());
}

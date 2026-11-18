export class LoginCancelled extends Error {}

export type DiscordPopup = Pick<Window, 'closed' | 'postMessage'>;

type MessageHost = Pick<Window, 'addEventListener' | 'removeEventListener'>;

const REPLY_EVENT = 'Auth result';
const POLL_MS = 500;

export function awaitDiscordToken(
  popup: DiscordPopup,
  origin: string,
  host: MessageHost = window,
  interval = POLL_MS,
): Promise<string> {
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setInterval> | undefined;

    function onMessage(event: MessageEvent) {
      if (event.origin !== origin || event.source !== popup) return;
      const token: unknown = (event.data as { token?: unknown } | null)?.token;
      if (typeof token !== 'string' || !token) return;
      popup.postMessage({ event: REPLY_EVENT, login: true }, origin);
      clearInterval(timer);
      host.removeEventListener('message', onMessage);
      resolve(token);
    }

    timer = setInterval(() => {
      if (!popup.closed) return;
      clearInterval(timer);
      host.removeEventListener('message', onMessage);
      reject(new LoginCancelled('Sign in cancelled'));
    }, interval);
    host.addEventListener('message', onMessage);
  });
}

export type DiscordLink = {
  code: string;
  redirect: string;
  state: string;
};

const LINK_EVENT = 'Discord link';
const LINK_REPLY_EVENT = 'Discord link received';
const CLOSE_GRACE_MS = 1000;

export function awaitDiscordLink(
  popup: DiscordPopup,
  origin: string,
  nonce: string,
  host: MessageHost = window,
  interval = POLL_MS,
  grace = CLOSE_GRACE_MS,
): Promise<DiscordLink> {
  return new Promise((resolve, reject) => {
    const timers: {
      grace?: ReturnType<typeof setTimeout>;
      poll?: ReturnType<typeof setInterval>;
    } = {};

    function stop() {
      clearInterval(timers.poll);
      clearTimeout(timers.grace);
      host.removeEventListener('message', onMessage);
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== origin || event.source !== popup) return;
      const data = event.data as Partial<DiscordLink> & { event?: unknown; nonce?: unknown } | null;
      if (data?.event !== LINK_EVENT || data.nonce !== nonce) return;
      const { code, redirect, state } = data;
      if (typeof code !== 'string' || typeof redirect !== 'string' || typeof state !== 'string') return;
      popup.postMessage({ event: LINK_REPLY_EVENT, nonce }, origin);
      stop();
      resolve({ code, redirect, state });
    }

    timers.poll = setInterval(() => {
      if (!popup.closed) return;
      clearInterval(timers.poll);
      timers.grace = setTimeout(() => {
        stop();
        reject(new LoginCancelled('Link cancelled'));
      }, grace);
    }, interval);
    host.addEventListener('message', onMessage);
  });
}

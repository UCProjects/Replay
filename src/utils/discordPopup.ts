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

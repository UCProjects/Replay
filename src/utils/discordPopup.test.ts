import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import { awaitDiscordToken, DiscordPopup, LoginCancelled } from './discordPopup';

const ORIGIN = 'https://auth.feildmaster.com';

function setup() {
  let listener: ((event: MessageEvent) => void) | undefined;
  const host = {
    addEventListener: (_type: string, fn: (event: MessageEvent) => void) => { listener = fn; },
    removeEventListener: () => { listener = undefined; },
  };
  const sent: unknown[] = [];
  const popup = {
    closed: false,
    postMessage: (message: unknown, target: unknown) => { sent.push([message, target]); },
  } as DiscordPopup;
  const deliver = (origin: string, source: unknown, data: unknown) => {
    listener?.({ data, origin, source } as MessageEvent);
  };
  return {
    deliver,
    host: host as unknown as Pick<Window, 'addEventListener' | 'removeEventListener'>,
    listening: () => listener !== undefined,
    popup,
    sent,
  };
}

describe('awaitDiscordToken', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('gives back the token and tells the popup the login was seen', async () => {
    const {
      deliver, host, listening, popup, sent,
    } = setup();
    const result = awaitDiscordToken(popup, ORIGIN, host);
    deliver(ORIGIN, popup, { token: 'abc' });
    await expect(result).resolves.toBe('abc');
    expect(sent).toEqual([[{ event: 'Auth result', login: true }, ORIGIN]]);
    expect(listening()).toBe(false);
  });

  it('ignores messages from another origin, another window, or without a token', async () => {
    const { deliver, host, popup } = setup();
    const result = awaitDiscordToken(popup, ORIGIN, host);
    deliver('https://evil.example', popup, { token: 'bad' });
    deliver(ORIGIN, {}, { token: 'bad' });
    deliver(ORIGIN, popup, { nothing: true });
    deliver(ORIGIN, popup, null);
    deliver(ORIGIN, popup, { token: 'good' });
    await expect(result).resolves.toBe('good');
  });

  it('gives up quietly when the popup is closed', async () => {
    const { host, listening, popup } = setup();
    const result = awaitDiscordToken(popup, ORIGIN, host, 100);
    const settled = expect(result).rejects.toBeInstanceOf(LoginCancelled);
    (popup as { closed: boolean }).closed = true;
    await vi.advanceTimersByTimeAsync(150);
    await settled;
    expect(listening()).toBe(false);
  });
});

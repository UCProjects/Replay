import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import {
  awaitDiscordLink, awaitDiscordToken, DiscordPopup, LoginCancelled,
} from './discordPopup';

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

describe('awaitDiscordLink', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const LINK = {
    event: 'Discord link', nonce: 'n1', code: 'c', redirect: 'r', state: 's',
  };

  it('gives back the link data and acknowledges it with the nonce', async () => {
    const {
      deliver, host, listening, popup, sent,
    } = setup();
    const result = awaitDiscordLink(popup, ORIGIN, 'n1', host);
    deliver(ORIGIN, popup, LINK);
    await expect(result).resolves.toEqual({ code: 'c', redirect: 'r', state: 's' });
    expect(sent).toEqual([[{ event: 'Discord link received', nonce: 'n1' }, ORIGIN]]);
    expect(listening()).toBe(false);
  });

  it('ignores another origin, another window, another nonce, or missing fields', async () => {
    const { deliver, host, popup } = setup();
    const result = awaitDiscordLink(popup, ORIGIN, 'n1', host);
    deliver('https://evil.example', popup, LINK);
    deliver(ORIGIN, {}, LINK);
    deliver(ORIGIN, popup, { ...LINK, nonce: 'other' });
    deliver(ORIGIN, popup, { ...LINK, event: 'Auth result' });
    deliver(ORIGIN, popup, { ...LINK, code: undefined });
    deliver(ORIGIN, popup, null);
    deliver(ORIGIN, popup, { ...LINK, code: 'good' });
    await expect(result).resolves.toEqual({ code: 'good', redirect: 'r', state: 's' });
  });

  it('still accepts the message shortly after the popup closes', async () => {
    const { deliver, host, popup } = setup();
    const result = awaitDiscordLink(popup, ORIGIN, 'n1', host, 100, 500);
    (popup as { closed: boolean }).closed = true;
    await vi.advanceTimersByTimeAsync(150);
    deliver(ORIGIN, popup, LINK);
    await expect(result).resolves.toEqual({ code: 'c', redirect: 'r', state: 's' });
  });

  it('gives up quietly once the popup has been closed past the grace period', async () => {
    const { host, listening, popup } = setup();
    const result = awaitDiscordLink(popup, ORIGIN, 'n1', host, 100, 500);
    const settled = expect(result).rejects.toBeInstanceOf(LoginCancelled);
    (popup as { closed: boolean }).closed = true;
    await vi.advanceTimersByTimeAsync(700);
    await settled;
    expect(listening()).toBe(false);
  });
});

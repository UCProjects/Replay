import { describe, expect, it } from 'vitest';
import { exchangeToken } from './exchangeToken';

const reply = (status: number, body: unknown) => () => Promise.resolve(new Response(
  typeof body === 'string' ? body : JSON.stringify(body),
  { status },
));

describe('exchangeToken', () => {
  it('sends the token and returns the one it gets back', async () => {
    let seen: { url?: string; init?: RequestInit } = {};
    const token = await exchangeToken('abc', (url, init) => {
      seen = { url, init };
      return Promise.resolve(new Response(JSON.stringify({ token: 'session' })));
    });
    expect(token).toBe('session');
    expect(seen.url).toBe('/login/exchange');
    expect(seen.init?.method).toBe('POST');
    expect(JSON.parse(seen.init?.body as string)).toEqual({ idToken: 'abc' });
  });

  it('uses the message the server gives when it refuses', async () => {
    await expect(exchangeToken('abc', reply(403, { error: 'Sign-in method not allowed' })))
      .rejects.toThrow('Sign-in method not allowed');
  });

  it('says what happened when the reply is not usable', async () => {
    await expect(exchangeToken('abc', reply(500, 'oops'))).rejects.toThrow('Sign in failed (500)');
    await expect(exchangeToken('abc', reply(200, {}))).rejects.toThrow('Sign in failed (200)');
  });
});

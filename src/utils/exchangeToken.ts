export const EXCHANGE_URL = '/login/exchange';

type Send = (url: string, init: RequestInit) => Promise<Response>;

export async function exchangeToken(idToken: string, send: Send = fetch): Promise<string> {
  const response = await send(EXCHANGE_URL, {
    body: JSON.stringify({ idToken }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  const body = await response.json().catch(() => ({})) as { error?: string; token?: unknown };
  if (!response.ok || typeof body.token !== 'string') {
    throw new Error(body.error ?? `Sign in failed (${response.status})`);
  }
  return body.token;
}

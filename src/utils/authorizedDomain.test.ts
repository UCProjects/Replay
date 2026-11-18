import { describe, expect, it } from 'vitest';
import { isAuthorizedHost } from './authorizedDomain';

const DOMAINS = [
  'localhost',
  'replay.uc.feildmaster.com',
  'feildmaster.com',
  'uc-spectate--preview-lpnmb29v.web.app',
  '127.0.0.1',
];

describe('isAuthorizedHost', () => {
  it('accepts a listed domain', () => {
    expect(isAuthorizedHost('replay.uc.feildmaster.com', DOMAINS)).toBe(true);
    expect(isAuthorizedHost('uc-spectate--preview-lpnmb29v.web.app', DOMAINS)).toBe(true);
    expect(isAuthorizedHost('localhost', DOMAINS)).toBe(true);
  });

  it('accepts a subdomain of a listed domain, like the Firebase SDK', () => {
    expect(isAuthorizedHost('wallet.feildmaster.com', DOMAINS)).toBe(true);
  });

  it('refuses a domain that is not listed', () => {
    expect(isAuthorizedHost('uc-spectate--pr12-next-abc123.web.app', DOMAINS)).toBe(false);
    expect(isAuthorizedHost('uc-spectate.web.app', DOMAINS)).toBe(false);
    expect(isAuthorizedHost('feildmaster.com.evil.example', DOMAINS)).toBe(false);
    expect(isAuthorizedHost('evilfeildmaster.com', DOMAINS)).toBe(false);
  });

  it('matches an IP address exactly', () => {
    expect(isAuthorizedHost('127.0.0.1', DOMAINS)).toBe(true);
    expect(isAuthorizedHost('10.127.0.0.1', DOMAINS)).toBe(false);
  });
});

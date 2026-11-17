import { describe, expect, it } from 'vitest';
import { linkErrorMessage, signInErrorMessage } from './authErrors';

function coded(code: string): Error {
  return Object.assign(new Error(`Firebase: Error (${code}).`), { code });
}

describe('signInErrorMessage', () => {
  it('points to the other sign-in method when the email already has an account', () => {
    expect(signInErrorMessage(coded('auth/account-exists-with-different-credential')))
      .toMatch(/different sign-in method/);
  });

  it('says nothing when the popup was closed', () => {
    expect(signInErrorMessage(coded('auth/popup-closed-by-user'))).toBe('');
    expect(signInErrorMessage(coded('auth/cancelled-popup-request'))).toBe('');
  });

  it('explains a blocked popup', () => {
    expect(signInErrorMessage(coded('auth/popup-blocked'))).toBe('Your browser blocked the sign-in window.');
  });

  it('keeps the text of an error that has no code', () => {
    expect(signInErrorMessage(new Error('Sign in failed (403)'))).toBe('Sign in failed (403)');
  });

  it('hides unknown firebase errors behind a plain message', () => {
    expect(signInErrorMessage(coded('auth/internal-error'))).toBe('Could not sign in.');
    expect(signInErrorMessage('nope')).toBe('Could not sign in.');
  });
});

describe('linkErrorMessage', () => {
  it('explains an account attached elsewhere', () => {
    expect(linkErrorMessage(coded('auth/credential-already-in-use')))
      .toBe('That account is already attached to a different account.');
  });

  it('does not use the sign-in messages', () => {
    expect(linkErrorMessage(coded('auth/account-exists-with-different-credential')))
      .toBe('Could not link that account.');
  });

  it('says nothing when the popup was closed', () => {
    expect(linkErrorMessage(coded('auth/popup-closed-by-user'))).toBe('');
  });
});

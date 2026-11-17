const ALREADY_ATTACHED = 'That account is already attached to a different account.';
const POPUP_BLOCKED = 'Your browser blocked the sign-in window.';

const LINK_MESSAGES: Record<string, string> = {
  'auth/credential-already-in-use': ALREADY_ATTACHED,
  'functions/already-exists': ALREADY_ATTACHED,
  'auth/provider-already-linked': 'That account type is already linked.',
  'auth/popup-blocked': POPUP_BLOCKED,
  'functions/permission-denied': 'Discord did not accept that sign-in.',
};

const SIGN_IN_MESSAGES: Record<string, string> = {
  'auth/account-exists-with-different-credential': 'This email already has an account that uses a different sign-in method. Sign in with that one, then link this one under Linked accounts.',
  'auth/popup-blocked': POPUP_BLOCKED,
};

const IGNORED = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];

function messageFor(error: unknown, messages: Record<string, string>, fallback: string): string {
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === 'string') {
    if (IGNORED.includes(code)) return '';
    if (messages[code]) return messages[code];
  }
  return error instanceof Error && !code ? error.message : fallback;
}

export function linkErrorMessage(error: unknown): string {
  return messageFor(error, LINK_MESSAGES, 'Could not link that account.');
}

export function signInErrorMessage(error: unknown): string {
  return messageFor(error, SIGN_IN_MESSAGES, 'Could not sign in.');
}

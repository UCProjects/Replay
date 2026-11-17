export type Language = {
  code: string;
  name: string;
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'cn', name: '中文' },
  { code: 'it', name: 'Italiano' },
  { code: 'pl', name: 'Polski' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ru', name: 'Русский' },
];

const BROWSER_CODES: Record<string, string> = {
  zh: 'cn',
};

export function gameLanguage(browserLanguage: string): string {
  const code = browserLanguage.slice(0, 2).toLowerCase();
  const mapped = BROWSER_CODES[code] ?? code;
  return LANGUAGES.some((language) => language.code === mapped) ? mapped : 'en';
}

const STORAGE_KEY = 'language';

type Storages = {
  local?: Pick<Storage, 'getItem'>;
  session?: Pick<Storage, 'getItem'>;
};

function read(storage: Pick<Storage, 'getItem'> | undefined): string | null {
  try {
    return storage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

export function savedLanguage({ local, session }: Storages): string | null {
  return read(session) ?? read(local);
}

export function saveLanguage(
  code: string,
  storage: () => Pick<Storage, 'setItem'> = () => localStorage,
): boolean {
  try {
    storage().setItem(STORAGE_KEY, code);
    return true;
  } catch {
    return false;
  }
}

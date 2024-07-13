import Banana from 'banana-i18n';
import {
  createContext,
  useCallback,
  useContext,
} from 'react';
import {
  translate,
  hasKey,
  loadLanguage,
} from '~/managers/lang';

export type TranslationContent = {
  loadLanguage: typeof loadLanguage;
  locale: Banana['locale'];
  ready: boolean;
  setLocale: (locale: string) => void;
  t: typeof translate;
};
export const TranslationContext = createContext<TranslationContent | undefined>(undefined);

export function useLoadLanguage(): TranslationContent['loadLanguage'] {
  const content = useContext(TranslationContext);
  if (content === undefined) {
    throw new Error('Used outside of provider');
  }
  const { loadLanguage: load } = content;
  return load;
}

export function useTranslation(): TranslationContent['t'] {
  const content = useContext(TranslationContext);
  if (content === undefined) {
    throw new Error('Used outside of provider');
  }
  const { t, locale, ready } = content;
  return useCallback(
    (...args: Parameters<TranslationContent['t']>) => {
      if (!locale || (!ready && !hasKey(args[0]))) return '';
      return t(...args);
    },
    [
      t, locale, ready,
    ],
  );
}

export function useSetLocale(): TranslationContent['setLocale'] {
  const content = useContext(TranslationContext);
  if (content === undefined) {
    throw new Error('Used outside of provider');
  }
  return content.setLocale;
}

import Banana from 'banana-i18n';
import {
  createContext,
  useCallback,
} from 'react';
import {
  translate,
  hasKey,
  loadLanguage,
  Translate,
} from '~/managers/lang';
import { useContent } from '~/hooks/useContent';

export type TranslationContent = {
  loadLanguage: typeof loadLanguage;
  locale: Banana['locale'];
  ready: boolean;
  setLocale: (locale: string) => void;
};
export const TranslationContext = createContext<TranslationContent | null>(null);

export function useLoadLanguage(): TranslationContent['loadLanguage'] {
  const { loadLanguage: load } = useContent(TranslationContext);
  return load;
}

export function useTranslation(): Translate {
  const { locale, ready } = useContent(TranslationContext);
  return useCallback(
    (...[message, ...args]: Parameters<Translate>) => {
      if (!locale || (!ready && !hasKey(message))) return '';
      return translate(message, ...args);
    },
    [locale, ready],
  );
}

export function useSetLocale(): TranslationContent['setLocale'] {
  const { setLocale } = useContent(TranslationContext);
  return setLocale;
}

export function useIsReady(): TranslationContent['ready'] {
  const { ready } = useContent(TranslationContext);
  return ready;
}

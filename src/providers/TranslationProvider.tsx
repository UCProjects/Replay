import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { TranslationContent, TranslationContext } from '~/hooks/useTranslation';
import {
  getLocale,
  loadLanguage,
  setLocale as setLang,
  translate,
} from '~/managers/lang';

export default function TranslationProvider({
  children,
}: PropsWithChildren): ReactNode {
  const [locale, setLocale] = useState(getLocale());
  const [ready, setReady] = useState(false);

  const handleLocaleChange = useCallback((newLocale: TranslationContent['locale']) => {
    setLang(newLocale);
    setLocale(newLocale);
  }, []);

  const handleLoadLanguage = useCallback(async (lang: string) => {
    await loadLanguage(lang);
    setReady(true);
  }, []);

  const value: TranslationContent = useMemo(() => ({
    loadLanguage: handleLoadLanguage,
    locale,
    ready,
    setLocale: handleLocaleChange,
    t: translate,
  }), [
    handleLoadLanguage,
    handleLocaleChange,
    locale,
    ready,
  ]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

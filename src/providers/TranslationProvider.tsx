import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TranslationContent, TranslationContext } from '~/hooks/useTranslation';
import {
  getLocale,
  hasLoaded,
  loadLanguage,
  setLocale as setLang,
} from '~/managers/lang';

export default function TranslationProvider({
  children,
}: PropsWithChildren): ReactNode {
  const [locale, setLocale] = useState(getLocale);
  const [ready, setReady] = useState(hasLoaded);

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
  }), [
    handleLoadLanguage,
    handleLocaleChange,
    locale,
    ready,
  ]);

  useEffect(() => {
    // console.log(value);
  }, [value]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

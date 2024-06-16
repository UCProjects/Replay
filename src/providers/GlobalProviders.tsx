import { ThemeProvider } from '@emotion/react';
import { PropsWithChildren, ReactNode } from 'react';
import theme from '~/routes/theme';
import TranslationProvider from './TranslationProvider';
import UserProvider from './UserProvider';

export default function GlobalProviders({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <TranslationProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

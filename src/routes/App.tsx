import {
  Container,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Header from '~/components/Header.tsx';
import Spinner from '~/components/Spinner.tsx';
import TranslationProvider from '~/providers/TranslationProvider.tsx';
import UserProvider from '~/providers/UserProvider.tsx';
import theme from './theme.ts';

function Body({ children }: PropsWithChildren): ReactNode {
  const { state } = useNavigation();
  return (
    <>
      <CssBaseline />
      <Spinner
        isOpen={state !== 'idle'}
      />
      <Container
        disableGutters
        maxWidth="lg"
      >
        <Header />
        <Outlet />
        {children}
      </Container>
    </>
  );
}

export default function App({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <TranslationProvider>
        <UserProvider>
          <Body>
            {children}
          </Body>
        </UserProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

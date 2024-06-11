import {
  Container,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Spinner from '../components/Spinner.tsx';
import UserProvider from '../providers/UserProvider.tsx';
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
        maxWidth="md"
      >
        <Outlet />
        {children}
      </Container>
    </>
  );
}

export default function App({ children }: PropsWithChildren): ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Body>
          {children}
        </Body>
      </UserProvider>
    </ThemeProvider>
  );
}

import {
  Container,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Spinner from '../components/Spinner.tsx';
import UserProvider from '../providers/UserProvider.tsx';
import theme from './theme.ts';

function Body(): ReactNode {
  const { state } = useNavigation();
  return (
    <>
      <CssBaseline />
      <Container
        disableGutters
        maxWidth="md"
      >
        <Outlet />
      </Container>
      <Spinner
        isOpen={state !== 'idle'}
      />
    </>
  );
}

export default function App(): ReactNode {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Body />
      </UserProvider>
    </ThemeProvider>
  );
}

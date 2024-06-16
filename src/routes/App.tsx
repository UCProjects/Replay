import {
  Container,
  CssBaseline,
} from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Header from '~/components/Header.tsx';
import Spinner from '~/components/Spinner.tsx';
import GlobalProviders from '~/providers/GlobalProviders.tsx';

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
    <GlobalProviders>
      <Body>
        {children}
      </Body>
    </GlobalProviders>
  );
}

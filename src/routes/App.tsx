import { Container, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Spinner from '../components/Spinner.tsx';

// TODO: Create theme
export default function App(): ReactNode {
  const { state } = useNavigation();

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="md"
        style={{
          backgroundColor: '#000',
          padding: 0,
        }}
      >
        <Outlet />
      </Container>
      <Spinner
        isOpen={state !== 'idle'}
      />
    </>
  );
}

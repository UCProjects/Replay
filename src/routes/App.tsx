import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { ReactNode } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import Spinner from '../components/Spinner.tsx';

const theme = createTheme();

export default function App(): ReactNode {
  const { state } = useNavigation();

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

import { ReactNode } from 'react';
import { Box } from '@mui/material';

import Search from './Search.tsx';
import Footer from '../Footer.tsx';
import { useIsAuthed } from '../../../../hooks/useUser.ts';

export default function Navigation(): ReactNode {
  const isAuthed = useIsAuthed();
  return (
    <>
      {isAuthed && <Search />}
      <Box
        component="footer"
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <Footer />
      </Box>
    </>
  );
}

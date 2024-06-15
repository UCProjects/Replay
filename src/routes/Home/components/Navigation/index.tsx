import { ReactNode } from 'react';
import { Box } from '@mui/material';

import Search from './Search.tsx';
import Footer from '../Footer.tsx';

export default function Navigation(): ReactNode {
  return (
    <>
      <Search />
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

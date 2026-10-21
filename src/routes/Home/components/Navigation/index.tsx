import { ReactNode } from 'react';
import { Box } from '@mui/material';

import Footer from '../Footer.tsx';

export default function Navigation(): ReactNode {
  return (
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
  );
}

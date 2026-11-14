import { ReactNode } from 'react';
import { Box } from '@mui/material';

import { usePro } from '~/hooks/usePro';
import Footer from '../Footer.tsx';
import ProBadge from '../ProBadge.tsx';

export type NavigationProps = {
  onShop: () => void;
};

export default function Navigation({ onShop }: NavigationProps): ReactNode {
  const pro = usePro();
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
      {pro === false && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 1 }}>
          <ProBadge onClick={onShop} />
        </Box>
      )}
      <Footer />
    </Box>
  );
}

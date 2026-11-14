import { ReactNode } from 'react';
import { WorkspacePremium } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';

import { usePro } from '~/hooks/usePro';
import Footer from '../Footer.tsx';

const PRO_COLOR = '#ffd54f';

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
          <Chip
            clickable
            icon={<WorkspacePremium sx={{ '&&': { color: PRO_COLOR } }} />}
            label="Buy Pro"
            onClick={onShop}
            sx={{ borderColor: PRO_COLOR, color: PRO_COLOR }}
            variant="outlined"
          />
        </Box>
      )}
      <Footer />
    </Box>
  );
}

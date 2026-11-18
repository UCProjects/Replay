import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { Tip } from '~/components/Tip';

export type UnavailableTipProps = {
  children: ReactElement;
  reason?: string;
};

export function UnavailableTip({ children, reason }: UnavailableTipProps): ReactElement {
  if (!reason) return children;
  return (
    <Tip title={reason}>
      <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Tip>
  );
}

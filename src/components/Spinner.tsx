import {
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { ReactNode } from 'react';

export type SpinnerProps = {
  isOpen: boolean;
};

export default function Spinner({
  isOpen = false,
}: SpinnerProps): ReactNode {
  return (
    <Backdrop
      open={isOpen}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

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
      sx={{
        color: '#fff',
      }}
      open={isOpen}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

import {
  Badge as Component,
  BadgeProps,
} from '@mui/material';
import { ReactNode } from 'react';

export default function Badge({
  children,
  ...props
}: BadgeProps): ReactNode {
  return (
    <Component
      color="primary"
      showZero
      sx={{
        marginX: '5px',
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

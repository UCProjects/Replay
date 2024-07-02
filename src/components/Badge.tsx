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
        '& .MuiBadge-badge': {
          backgroundColor: 'var(--bgcolor-2)',
        },
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

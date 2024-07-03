import {
  Badge as Component,
  BadgeProps,
} from '@mui/material';
import { forwardRef } from 'react';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
  children,
  ...props
}, ref) => (
  <Component
    color="primary"
    ref={ref}
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
));

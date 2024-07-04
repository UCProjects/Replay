import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({
  children,
  ...props
}, ref) => (
  <MuiLink
    component={RouterLink}
    {...props}
    ref={ref}
  >
    {children}
  </MuiLink>
));

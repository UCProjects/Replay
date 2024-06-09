import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';

export default function Link({
  children,
  ...props
}: LinkProps): ReactNode {
  return (
    <MuiLink
      component={RouterLink}
      {...props}
    >
      {children}
    </MuiLink>
  );
}

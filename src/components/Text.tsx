import { Box, BoxProps } from '@mui/material';
import { forwardRef } from 'react';

export type TextProps = BoxProps & {
  html?: string,
};

export const Text = forwardRef<HTMLDivElement, TextProps>(({
  children,
  html,
  ...props
}, ref) => (
  <Box
    {...props}
    dangerouslySetInnerHTML={html ? {
      __html: html,
    } : undefined}
    ref={ref}
  >
    {children}
  </Box>
));

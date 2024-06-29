import { Unstable_Grid2 as Grid, Grid2Props } from '@mui/material';
import { forwardRef } from 'react';

export type FlexProps = Grid2Props;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({
  children,
  ...props
}, ref) => (
  <Grid
    {...props}
    ref={ref}
  >
    {children}
  </Grid>
));

export default Flex;

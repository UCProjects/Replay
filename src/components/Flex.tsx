import { Unstable_Grid2 as Grid, Grid2Props } from '@mui/material';
import { ReactNode } from 'react';

export type FlexProps = Grid2Props;

export default function Flex({
  children,
  ...props
}: FlexProps): ReactNode {
  return (
    <Grid
      {...props}
    >
      {children}
    </Grid>
  );
}

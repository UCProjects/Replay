import { Unstable_Grid2 as Grid, Grid2Props as GridProps } from '@mui/material';
// export { Grid2Props as FlexProps } from '@mui/material';

export type FlexProps = GridProps;

export default function Flex({
  children,
  ...props
}: FlexProps) {
  return (
    <Grid
      {...props}
    >
      {children}
    </Grid>
  );
}

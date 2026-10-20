import {
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import { forwardRef } from 'react';

export const Tip = styled(forwardRef(({ className, ...props }: TooltipProps, ref) => (
  <Tooltip {...props} classes={{ popper: className }} ref={ref} />
)))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #fff',
    textAlign: 'left',
  },
}));

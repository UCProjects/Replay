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
    backgroundColor: 'var(--bgcolor-2)',
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}));

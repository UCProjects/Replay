import {
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';

export const Tip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--bgcolor-2)',
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #dadde9',
  },
}));

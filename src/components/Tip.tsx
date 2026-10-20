import {
  ClickAwayListener,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import {
  forwardRef,
  useCallback,
  useState,
} from 'react';

export const Tip = styled(forwardRef(({ className, ...props }: TooltipProps, ref) => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Tooltip
        enterTouchDelay={0}
        leaveTouchDelay={2 ** 31 - 1}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        {...props}
        classes={{ popper: className }}
        ref={ref}
      />
    </ClickAwayListener>
  );
}))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    fontSize: theme.typography.pxToRem(16),
    border: '1px solid #fff',
    textAlign: 'left',
  },
}));

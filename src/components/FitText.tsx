import { Box, BoxProps } from '@mui/material';
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import resizeText from '~/utils/resizeText';

export type FitTextProps = BoxProps & {
  fitBoth?: boolean,
  fitHeight?: boolean,
  size?: number,
  html?: string,
};

export const FitText = forwardRef<HTMLElement, FitTextProps>(({
  children,
  fitBoth: both,
  fitHeight: height,
  size,
  html,
  ...props
}, ref) => {
  const ourRef = useRef<HTMLElement>();

  useImperativeHandle(ref, () => ourRef.current!, []);

  useLayoutEffect(() => {
    const el = ourRef.current;
    if (!el) return;
    const resize = () => resizeText(el, {
      both,
      height,
      size,
    });
    // For some reason, we don't always resize correctly on page load...
    if (!resize()) {
      setTimeout(resize, 10);
    }
  }, [
    both,
    height,
    html,
    ourRef,
    size,
  ]);

  return (
    <Box
      {...props}
      dangerouslySetInnerHTML={html ? {
        __html: html,
      } : undefined}
      ref={ourRef}
    >
      {children}
    </Box>
  );
});

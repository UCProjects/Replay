import { styled } from '@mui/material';
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Card } from '~/components/Card';
import { useHighlights, useIsTurn, usePlayback } from '~/hooks/useGame';
import { WithSlot } from '~/types/game';
import { CardZoom } from './CardZoom';

type StyledSlotProps = {
  active?: boolean;
  isOpponent: boolean;
};

export type SlotProps = WithSlot<StyledSlotProps>;

const StyledSlot = styled('div')<StyledSlotProps>(({ active, isOpponent, theme }) => theme.unstable_sx({
  order: 0,
  width: '25%',
  padding: '5px',
  backgroundColor: `var(--${isOpponent ? 'opponent' : 'player'})`,
  border: '1px solid var(--bgcolor)',
  borderColor: active ? 'rgb(255, 255, 0)' : 'var(--bgcolor)',
  '@media (orientation: portrait)': {
    sm: {
      borderWidth: 1,
      width: '25%',
      maxHeight: 'unset',
      order: 0,
    },
    xs: {
      borderWidth: 0,
      width: '50%',
      maxHeight: 152,
      order: isOpponent ? 1 : 0,
    },
  },
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
}));

const OWN_TIPS = '.card-status, .card-tribes, [data-card], [data-kw]';

export function Slot({
  isOpponent,
  data,
}: SlotProps): ReactNode {
  const {
    attacking,
    defending,
    effectCards,
  } = useHighlights();
  const active = useIsTurn(isOpponent);
  const [zoomed, setZoomed] = useState(false);
  const { pause, play, playing } = usePlayback();
  const resume = useRef(false);
  const handleOpen = useCallback((event: MouseEvent) => {
    const { target } = event;
    if (target instanceof Element && target.closest(OWN_TIPS)) return;
    resume.current = playing;
    pause();
    setZoomed(true);
  }, [pause, playing]);
  const handleClose = useCallback(() => {
    setZoomed(false);
    if (resume.current) play();
    resume.current = false;
  }, [play]);

  useEffect(() => {
    if (!data && zoomed) handleClose();
  }, [data, handleClose, zoomed]);
  const id = data?.id ?? -1;
  let mark = '';
  if (attacking.includes(id)) mark = 'card-attacking';
  else if (defending.includes(id)) mark = 'card-defending';
  else if (effectCards.includes(id)) mark = 'effectActive';
  return (
    <>
      <StyledSlot
        active={active}
        className="slot"
        data-card-id={data?.id}
        isOpponent={isOpponent}
        onClick={data ? handleOpen : undefined}
        sx={data ? { cursor: 'zoom-in' } : undefined}
      >
        <Card
          data={data}
          mark={mark}
        />
      </StyledSlot>
      <CardZoom
        data={data}
        onClose={handleClose}
        open={zoomed}
      />
    </>
  );
}

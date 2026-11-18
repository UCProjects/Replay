import { Box, styled } from '@mui/material';
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
import { EnchantSlot, WithSlot } from '~/types/game';
import { CardZoom } from './CardZoom';
import { SlotEnchant } from './SlotEnchant';

type StyledSlotProps = {
  active?: boolean;
  isOpponent: boolean;
  tint?: 'affected' | 'effect';
};

const TINT = {
  affected: 'rgba(255, 204, 0, 0.4)',
  effect: 'rgba(42, 171, 210, 0.4)',
} as const;

export type SlotProps = WithSlot<Omit<StyledSlotProps, 'tint'> & {
  enchant?: EnchantSlot;
  index?: number;
}>;

const StyledSlot = styled('div')<StyledSlotProps>(({
  active,
  isOpponent,
  theme,
  tint,
}) => theme.unstable_sx({
  order: 0,
  position: 'relative',
  backgroundImage: tint ? `linear-gradient(${TINT[tint]}, ${TINT[tint]})` : undefined,
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

const OWN_TIPS = '.card-status, .card-tribes, .enchant-info, [data-card], [data-kw]';

export function Slot({
  isOpponent,
  data,
  enchant = null,
  index = -1,
}: SlotProps): ReactNode {
  const {
    affectedSlots,
    attacking,
    defending,
    effectCards,
    effectSlots,
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
  let tint: StyledSlotProps['tint'];
  if (effectSlots.includes(index)) tint = 'effect';
  else if (affectedSlots.includes(index)) tint = 'affected';
  return (
    <>
      <StyledSlot
        active={active}
        className="slot"
        data-card-id={data?.id}
        isOpponent={isOpponent}
        onClick={data ? handleOpen : undefined}
        sx={data ? { cursor: 'zoom-in' } : undefined}
        tint={tint}
      >
        {enchant && <SlotEnchant enchant={enchant} />}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            data={data}
            mark={mark}
          />
        </Box>
      </StyledSlot>
      <CardZoom
        data={data}
        onClose={handleClose}
        open={zoomed}
      />
    </>
  );
}

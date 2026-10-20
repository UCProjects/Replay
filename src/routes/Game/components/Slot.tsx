import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '~/components/Card';
import { useHighlights, useIsTurn } from '~/hooks/useGame';
import { WithSlot } from '~/types/game';

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
  const id = data?.id ?? -1;
  let mark = '';
  if (attacking.includes(id)) mark = 'card-attacking';
  else if (defending.includes(id)) mark = 'card-defending';
  else if (effectCards.includes(id)) mark = 'effectActive';
  return (
    <StyledSlot
      active={active}
      className="slot"
      isOpponent={isOpponent}
    >
      <Card
        data={data}
        mark={mark}
      />
    </StyledSlot>
  );
}

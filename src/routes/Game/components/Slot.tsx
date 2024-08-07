import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '~/components/Card';
import { WithSlot } from '~/types/game';

type StyledSlotProps = {
  isOpponent: boolean;
};

export type SlotProps = WithSlot<StyledSlotProps>;

const StyledSlot = styled('div')<StyledSlotProps>(({ isOpponent, theme }) => theme.unstable_sx({
  order: 0,
  width: '25%',
  padding: '5px',
  backgroundColor: `var(--${isOpponent ? 'opponent' : 'player'})`,
  border: '1px solid var(--bgcolor)',
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
  return (
    <StyledSlot isOpponent={isOpponent}>
      <Card data={data} />
    </StyledSlot>
  );
}

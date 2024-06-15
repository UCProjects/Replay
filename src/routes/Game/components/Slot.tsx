import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '~/components/Card';
import { Slot as SlotData } from '~/types/game';

type StyledSlotProps = {
  isOpponent: boolean;
};

export type SlotProps = StyledSlotProps & {
  data: SlotData;
};

const StyledSlot = styled('div')<StyledSlotProps>(({ isOpponent, theme }) => theme.unstable_sx({
  width: '25%',
  padding: 5,
  backgroundColor: `var(--${isOpponent ? 'opponent' : 'player'})`,
  border: {
    sm: '1px solid var(--bgcolor)',
    xs: {
      '(orientation: portrait)': 0,
    },
  },
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

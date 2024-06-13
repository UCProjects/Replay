import { styled } from '@mui/material';
import { ReactNode } from 'react';
import Flex from '~/components/Flex';
import { GameBoard } from '~/types/game';

export type BoardProps = {
  board: GameBoard;
};

const Slot = styled(Flex)({
  // TODO: style slot
});

export default function Board({
  board,
}: BoardProps): ReactNode {
  // TODO: Render card
  return board.map((_card) => <Slot>{null}</Slot>);
}

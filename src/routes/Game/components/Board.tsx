import { styled } from '@mui/material';
import { ReactNode } from 'react';
import { GameBoard } from '../../../types/game';
import Flex from '../../../components/Flex';

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
  return board.map((card) => <Slot>{card}</Slot>);
}

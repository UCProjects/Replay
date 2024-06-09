import { Box } from '@mui/material';
import {
  ReactNode,
} from 'react';

import { GameBoard, Player } from '../../types/game';
import Profile from './components/Profile';
import Board from './components/Board';
import './game.css';

export default function Game(): ReactNode {
  // TODO: Context to provide game state
  // TODO: Context to provide game controller
  return (
    <Box>
      <Profile player={null as unknown as Player} />
      <Board board={[] as unknown as GameBoard} />
      <Profile player={null as unknown as Player} />
    </Box>
  );
}

import { Box } from '@mui/material';
import {
  ReactNode,
} from 'react';

import Profile from './components/Profile';
import Board from './components/Board';
import './game.css';

export default function Game(): ReactNode {
  // TODO: Context to provide game state
  // TODO: Context to provide game controller
  return (
    <Box>
      <Profile />
      <Board />
      <Profile />
    </Box>
  );
}

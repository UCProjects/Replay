import { Box } from '@mui/material';
import {
  ReactNode,
} from 'react';
import {
  LoaderFunctionArgs,
} from 'react-router-dom';

import Profile from './components/Profile';
import Board from './components/Board';
import './game.css';

export async function loader({
  params,
  request,
}: LoaderFunctionArgs): Promise<any> {
  // TODO: Preload game
  await Promise.all([params, request]);
  return null;
}

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

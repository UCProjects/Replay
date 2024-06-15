import { Box } from '@mui/material';
import {
  ReactNode,
  useMemo,
} from 'react';

import { GameState } from '~/types/game';
import Profile from './components/Profile';
import { Slot } from './components/Slot';
import './game.css';

export default function Game(): ReactNode {
  const state = {} as unknown as GameState;
  // const [gameBoard, setGameBoard] = useState(state.board);
  const board = useMemo(
    () => state.board.map((slot, i) => (
      <Slot
        data={slot}
        isOpponent={i < 4}
        key={`slot-${i + 1}`}
      />
    )),
    [state.board],
  );
  // TODO: Header
  // TODO: Context to provide game state
  // TODO: Context to provide game controller
  return (
    <Box>
      <Profile isOpponent player={state.players[1]} />
      {board}
      <Profile player={state.players[0]} />
    </Box>
  );
}

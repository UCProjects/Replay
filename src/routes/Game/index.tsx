import { Box } from '@mui/material';
import {
  ReactNode,
  useMemo,
} from 'react';

import Flex from '~/components/Flex';
import { useGameState } from '~/hooks/useGame';
import { GameProvider } from '~/providers/GameProvider';
import Profile from './components/Profile';
import { Slot } from './components/Slot';
import './game.css';

// TODO: Add controls... somehow?
function Render(): ReactNode {
  const state = useGameState();

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

  return (
    <Box
      className="gameBoard"
    >
      <Profile isOpponent player={state.players[1]} />
      <Flex container>
        {board}
      </Flex>
      <Profile player={state.players[0]} />
    </Box>
  );
}

export default function Game(): ReactNode {
  return (
    <GameProvider>
      <Render />
    </GameProvider>
  );
}

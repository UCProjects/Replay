import { Box } from '@mui/material';
import {
  ReactNode,
  useMemo,
} from 'react';
import Flex from '~/components/Flex';
import { useGameState } from '~/hooks/useGame';
import { GameProvider } from '~/providers/GameProvider';
import ActiveCard from './components/ActiveCard';
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
      <Profile player={state.players[1]} />
      <Flex
        container
        sx={{
          // TODO: This needs more restrictions
          '@media (orientation: portrait)': {
            sm: {
              flexDirection: 'row',
              maxHeight: 'unset',
            },
            xs: {
              flexDirection: 'column',
              maxHeight: '608px',
            },
          },
        }}
      >
        {board}
      </Flex>
      <Profile player={state.players[0]} />
      <ActiveCard />
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

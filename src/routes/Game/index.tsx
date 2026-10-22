import { Box } from '@mui/material';
import {
  ReactNode,
  useMemo,
} from 'react';
import { CardPreview } from '~/components/CardPreview';
import { Flex } from '~/components/Flex';
import { KeywordTip } from '~/components/KeywordTip';
import { useGameState } from '~/hooks/useGame';
import { GameProvider } from '~/providers/GameProvider';
import ActiveCard from './components/ActiveCard';
import Controls from './components/Controls';
import Profile from './components/Profile';
import { Slot } from './components/Slot';
import './game.css';

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
      <Profile player={state.players[0]} />
      <Box sx={{ position: 'relative' }}>
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
        <ActiveCard />
      </Box>
      <Profile player={state.players[1]} />
      <Controls />
      <CardPreview />
      <KeywordTip />
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

import { Box } from '@mui/material';
import {
  ReactNode,
  useMemo,
} from 'react';
import { CardPreview } from '~/components/CardPreview';
import { Flex } from '~/components/Flex';
import { KeywordTip } from '~/components/KeywordTip';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useGame, useGameState } from '~/hooks/useGame';
import { usePageTitle } from '~/hooks/usePageTitle';
import { useLoaderData } from 'react-router-dom';
import { GameProvider } from '~/providers/GameProvider';
import ActiveCard from './components/ActiveCard';
import { AnimationLayer } from './components/AnimationLayer';
import Controls from './components/Controls';
import GameGate from './components/GameGate';
import Profile from './components/Profile';
import { Slot } from './components/Slot';
import { GateData } from './loader';
import './game.css';

function Render(): ReactNode {
  const state = useGameState();
  const { users: [opponent, player] } = useGame();
  const displayName = useDisplayName();
  usePageTitle(`${displayName(player.name)} vs ${displayName(opponent.name)}`);

  const board = useMemo(
    () => state.board.map((slot, i) => (
      <Slot
        data={slot}
        enchant={state.slots[i]}
        index={i}
        isOpponent={i < 4}
        key={`slot-${i + 1}`}
      />
    )),
    [state.board, state.slots],
  );

  return (
    <Box
      className="gameBoard"
    >
      <Profile player={state.players[0]} />
      <Box data-board sx={{ position: 'relative' }}>
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
      <AnimationLayer />
    </Box>
  );
}

export default function Game(): ReactNode {
  const data = useLoaderData();
  if (!Array.isArray(data)) return <GameGate {...(data as GateData).gate} />;
  return (
    <GameProvider>
      <Render />
    </GameProvider>
  );
}

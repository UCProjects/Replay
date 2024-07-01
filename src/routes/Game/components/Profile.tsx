import { EmojiEvents, Star } from '@mui/icons-material';
import { BadgeProps, styled } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { Flex } from '~/components/Flex';
import { Player } from '~/types/game';
import Badge from '~/components/Badge';
import { useGame, useGameState } from '~/hooks/useGame';
import { Artifacts } from './Artifacts';

export type ProfileProps = {
  player: Player;
};

const Img = styled('img')({
  height: 28,
});

export default function Profile({
  player: {
    artifacts,
    deck = 0,
    dodge = 0, // TODO: Convert to react element?
    gold = 0,
    hand = 0,
    health = 0,
    id = 0,
    isOpponent = false,
    lives = 0,
    maxHealth,
    user,
  },
}: ProfileProps): ReactNode {
  const { results } = useGame();
  const state = useGameState();

  const isCurrentTurn = useMemo(
    () => state.turnPlayer.id === id,
    [id, state.turnPlayer],
  );

  const isVictor = useMemo(
    () => state.action === 'finished' && results.winner?.id === id,
    [
      results,
      state.action,
      id,
    ],
  );

  const anchor: BadgeProps['anchorOrigin'] = {
    horizontal: isOpponent ? 'left' : 'left',
    vertical: !isOpponent ? 'top' : 'bottom',
  };

  // TODO: MUI-fy
  return (
    <Flex
      alignItems="center"
      className={isOpponent ? 'opponent' : 'player'}
      container
      data-user-id={id}
      justifyContent="space-between"
      overflow="hidden"
      position="relative"
      sx={{
        border: {
          sm: '1px solid var(--bgcolor)',
          xs: 0,
        },
      }}
    >
      <Flex
        alignItems="center"
        className="user-info"
        container
        flexGrow={0}
      >
        <span
          className="name"
          data-soul={user.class}
        >
          {user.name}
        </span>
        <Artifacts
          artifacts={artifacts}
          isOpponent={isOpponent}
        />
        {isCurrentTurn && (
          <Badge
            anchorOrigin={{
              horizontal: 'right',
              vertical: !isOpponent ? 'top' : 'bottom',
            }}
            badgeContent={state.turn}
          >
            <Star
              sx={{
                color: 'yellow',
              }}
            />
          </Badge>
        )}
        {isVictor && (
          <EmojiEvents
            sx={{
              marginLeft: '5px',
            }}
          />
        )}
      </Flex>
      <Flex
        className="playerHealth"
      >
        <progress
          className="hpBar"
          data-dodge={dodge}
          data-health={health}
          data-lives={lives}
          max={maxHealth}
          value={health}
        />
      </Flex>
      <Flex
        className="player-info"
        flexGrow={0}
      >
        <Badge
          anchorOrigin={anchor}
          badgeContent={deck}
        >
          <Img alt="deck" src="/images/board/cards.png" />
        </Badge>
        <Badge
          anchorOrigin={anchor}
          badgeContent={hand}
        >
          <Img alt="hand" src="/images/board/hand.png" />
        </Badge>
        <Badge
          anchorOrigin={anchor}
          badgeContent={gold}
        >
          <Img alt="gold" src="/images/board/gold.png" />
        </Badge>
      </Flex>
    </Flex>
  );
}

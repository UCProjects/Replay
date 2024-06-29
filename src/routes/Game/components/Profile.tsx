import { BadgeProps, styled } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import Flex from '~/components/Flex';
import { Player } from '~/types/game';
import Badge from '~/components/Badge';
import { useGame, useGameState } from '~/hooks/useGame';

export type ProfileProps = {
  player: Player;
};

const Img = styled('img')({
  height: 28,
});

export default function Profile({
  player: {
    deck = 0,
    dodge = 0, // TODO: Convert to react element?
    gold = 0,
    hand = 0,
    id = 0,
    isOpponent = false,
    health = 0,
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

  const isVictor = useMemo(() => {
    if (state.action === 'finished') {
      return results.winner?.id === id;
    }
    return false;
  }, [
    results,
    state.action,
    id,
  ]);

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
        className="user-info"
        flexGrow={0}
      >
        <span className="name">{user.name}</span>
        <span className="artifacts" />
        {isCurrentTurn && <span className="turn-icon material-icons">star</span>}
        {isVictor && <span className="victor material-icons">emoji_events</span>}
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

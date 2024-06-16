import { ReactNode } from 'react';
import Flex from '~/components/Flex';
import { Player } from '~/types/game';
import Badge from '~/components/Badge';
import { styled } from '@mui/material';

export type ProfileProps = {
  isCurrentTurn?: boolean;
  isOpponent?: boolean;
  isVictor?: boolean;
  player: Player;
};

const Img = styled('img')({
  height: 20,
});

export default function Profile({
  isOpponent = false, // FIXME: We should be able to dynamically detect these values
  isCurrentTurn = false, // FIXME
  isVictor = false, // FIXME
  player: {
    deck = 0,
    dodge = 0, // TODO: Convert to react element?
    gold = 0,
    hand = 0,
    id = 0,
    health = 0,
    lives = 0,
    maxHealth,
    user,
  },
}: ProfileProps): ReactNode {
  // TODO: getGameState()
  // TODO: MUI-fy

  return (
    <Flex
      alignItems="center"
      className={isOpponent ? 'opponent' : 'player'}
      container
      data-user-id={id}
      justifyContent="space-between"
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
          anchorOrigin={{
            vertical: isOpponent ? 'top' : 'bottom',
            horizontal: isOpponent ? 'left' : 'left',
          }}
          badgeContent={deck}
        >
          <Img alt="cards" src="/images/board/cards.png" />
        </Badge>
        <Badge
          anchorOrigin={{
            vertical: isOpponent ? 'top' : 'bottom',
            horizontal: isOpponent ? 'left' : 'left',
          }}
          badgeContent={hand}
        >
          <Img alt="hand" src="/images/board/hand.png" />
        </Badge>
        <Badge
          anchorOrigin={{
            vertical: isOpponent ? 'top' : 'bottom',
            horizontal: isOpponent ? 'left' : 'left',
          }}
          badgeContent={gold}
        >
          <Img alt="gold" src="/images/board/gold.png" />
        </Badge>
      </Flex>
    </Flex>
  );
}

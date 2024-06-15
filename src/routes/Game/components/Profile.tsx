import { Badge } from '@mui/material';
import { ReactNode } from 'react';
import Flex from '~/components/Flex';
import { Player } from '~/types/game';

export type ProfileProps = {
  isCurrentTurn?: boolean;
  isOpponent?: boolean;
  isVictor?: boolean;
  player: Player;
};

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
      className={isOpponent ? 'opponent' : 'player'}
      container
      data-userId={id}
    >
      <Flex
        className="user-info"
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
      >
        <Badge
          badgeContent={deck}
          showZero
        >
          <img alt="cards" src="/images/board/cards.png" />
        </Badge>
        <Badge
          badgeContent={hand}
          showZero
        >
          <img alt="hand" src="/images/board/hand.png" />
        </Badge>
        <Badge
          badgeContent={gold}
          showZero
        >
          <img alt="gold" src="/images/board/gold.png" />
        </Badge>
      </Flex>
    </Flex>
  );
}

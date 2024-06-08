import { ReactNode } from 'react';
import Flex from '../../../components/Flex';
import { Player } from '../../../types/game';

import cardImage from '../../../assets/images/board/cards.png';
import goldImage from '../../../assets/images/board/gold.png';
import handImage from '../../../assets/images/board/hand.png';

export type ProfileProps = {
  isOpponent?: boolean;
  player: Player;
};

export default function Profile({
  isOpponent = false,
  player,
}: ProfileProps): ReactNode {
  // TODO: getUser by id
  // TODO: MUI-fy
  return (
    <Flex
      className={isOpponent ? 'opponent' : 'player'}
      container
    >
      <Flex
        className="user-info"
      >
        <span className="name">{player.id}</span>
        <span className="artifacts" />
        <span className="turn-icon material-icons">star</span>
        <span className="victor material-icons">emoji_events</span>
      </Flex>
      <Flex
        className="playerHealth"
      >
        <progress className="hpBar" max="30" value="30" />
      </Flex>
      <Flex
        className="player-info"
      >
        <img alt="cards" src={cardImage} />
        <span className="player-cards rounded-bg" />
        <img alt="hand" src={handImage} />
        <span className="player-hand rounded-bg" />
        <img alt="gold" src={goldImage} />
        <span className="player-gold rounded-bg" />
      </Flex>

    </Flex>
  );
}

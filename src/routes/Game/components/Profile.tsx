import { EmojiEvents, Star } from '@mui/icons-material';
import {
  BadgeProps,
  Divider,
  styled,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { Flex } from '~/components/Flex';
import { Player } from '~/types/game';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import { useGame, useGameState } from '~/hooks/useGame';
import { useTranslation } from '~/hooks/useTranslation';
import { Artifacts } from './Artifacts';
import { ProfileIcon } from './ProfileIcon';

export type ProfileProps = {
  player: Player;
};

type UsernameProps = {
  name: string;
  soul: string;
};

const Img = styled('img')({
  height: 28,
});

function Username({
  name,
  soul,
}: UsernameProps): ReactNode {
  const t = useTranslation();
  return (
    <Tip
      placement="top"
      title={(
        <Flex>
          <Text html={t(`{{SOUL:${soul}}}`)} />
          <Divider />
          <Text html={t(`{{SOUL:${soul}-desc}}`)} />
        </Flex>
      )}
    >
      <span
        className="name"
        data-soul={soul}
      >
        {name}
      </span>
    </Tip>
  );
}

export default function Profile({
  player: {
    artifacts,
    deck = 0,
    dodge = 0, // TODO: Convert to react element?
    gold = 0,
    hand = 0,
    health = 0,
    id,
    isOpponent = false,
    lives = 0,
    maxHealth,
    user,
  },
}: ProfileProps): ReactNode {
  const { results, type } = useGame();
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

  const anchor: BadgeProps['anchorOrigin'] = useMemo(() => ({
    horizontal: isOpponent ? 'left' : 'left',
    vertical: !isOpponent ? 'top' : 'bottom',
  }), [isOpponent]);

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
        data-rank={type === 'RANKED' ? user.rank.substring(0, 1) : undefined}
        flexGrow={0}
      >
        <Username
          name={user.name}
          soul={user.class}
        />
        <Artifacts
          artifacts={artifacts}
          isOpponent={isOpponent}
        />
        {isCurrentTurn && (
          <ProfileIcon
            anchor={{
              horizontal: 'right',
              vertical: anchor.vertical,
            }}
            badge={state.turn}
          >
            <Star
              sx={{
                color: 'yellow',
              }}
            />
          </ProfileIcon>
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
        <ProfileIcon
          anchor={anchor}
          badge={deck}
          tip="replay.deck"
        >
          <Img alt="deck" src="/images/board/cards.png" />
        </ProfileIcon>
        <ProfileIcon
          anchor={anchor}
          badge={hand}
          tip="replay.hand"
        >
          <Img alt="hand" src="/images/board/hand.png" />
        </ProfileIcon>
        <ProfileIcon
          anchor={anchor}
          badge={gold}
          tip="replay.gold"
        >
          <Img alt="gold" src="/images/board/gold.png" />
        </ProfileIcon>
      </Flex>
    </Flex>
  );
}

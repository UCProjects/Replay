import { EmojiEvents, Star } from '@mui/icons-material';
import { BadgeProps, Divider, styled } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { Flex } from '~/components/Flex';
import { Player } from '~/types/game';
import Badge from '~/components/Badge';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import { useGame, useGameState } from '~/hooks/useGame';
import { useTranslation } from '~/hooks/useTranslation';
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
  const { results, type } = useGame();
  const state = useGameState();
  const t = useTranslation();

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
        data-rank={type === 'RANKED' ? user.rank.substring(0, 1) : undefined}
        flexGrow={0}
      >
        <Tip
          placement="top"
          title={(
            <Flex>
              <Text html={t(`{{SOUL:${user.class}}}`)} />
              <Divider />
              <Text html={t(`{{SOUL:${user.class}-desc}}`)} />
            </Flex>
          )}
        >
          <span
            className="name"
            data-soul={user.class}
          >
            {user.name}
          </span>
        </Tip>
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
          <Tip
            placement={anchor.vertical}
            title="Deck"
          >
            <Img alt="deck" src="/images/board/cards.png" />
          </Tip>
        </Badge>
        <Badge
          anchorOrigin={anchor}
          badgeContent={hand}
        >
          <Tip
            placement={anchor.vertical}
            title="Hand"
          >
            <Img alt="hand" src="/images/board/hand.png" />
          </Tip>
        </Badge>
        <Badge
          anchorOrigin={anchor}
          badgeContent={gold}
        >
          <Tip
            placement={anchor.vertical}
            title="Gold"
          >
            <Img alt="gold" src="/images/board/gold.png" />
          </Tip>
        </Badge>
      </Flex>
    </Flex>
  );
}

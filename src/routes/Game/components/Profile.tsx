import { EmojiEvents, Star } from '@mui/icons-material';
import {
  BadgeProps,
  Box,
  Divider,
  styled,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { Flex } from '~/components/Flex';
import { Player } from '~/types/game';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import {
  useGame, useGameState, useHighlights, useIsTurn,
} from '~/hooks/useGame';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useTranslation } from '~/hooks/useTranslation';
import { storyFightOf } from '~/utils/storyFight';
import { Artifacts } from './Artifacts';
import { ProfileIcon } from './ProfileIcon';

export type ProfileProps = {
  player: Player;
};

type UsernameProps = {
  active: boolean;
  name: string;
  soul: string;
};

const Img = styled('img')({
  height: 28,
});

type StatProps = {
  alt: string;
  image: string;
  tip: string;
  value: ReactNode;
};

const Value = styled('span')({
  backgroundColor: 'var(--bgcolor-2)',
  borderRadius: 10,
  margin: '0 5px',
  padding: '0 5px',
});

function Stat({
  alt,
  image,
  tip,
  value,
}: StatProps): ReactNode {
  const t = useTranslation();
  return (
    <Tip title={t(tip)}>
      <Flex alignItems="center" className="stat" container flexGrow={0} wrap="nowrap">
        <Img alt={alt} src={`/images/board/${image}.png`} />
        <Value className="stat-value">{value}</Value>
      </Flex>
    </Tip>
  );
}

function Username({
  active,
  name,
  soul,
}: UsernameProps): ReactNode {
  const t = useTranslation();
  const displayName = useDisplayName();
  const fight = soul === 'MONSTER' ? storyFightOf(name) : undefined;
  const storySoul = fight ? t(`soul-monster-${fight}`) : '';
  return (
    <Tip
      placement="top"
      title={(
        <Flex>
          <Text html={storySoul || t(`{{SOUL:${soul}}}`)} />
          <Divider />
          <Text html={storySoul ? t(`soul-monster-${fight}-desc`) : t(`{{SOUL:${soul}-desc}}`)} />
        </Flex>
      )}
    >
      <span
        className={active ? 'name effectActive' : 'name'}
        data-soul={soul}
      >
        {displayName(name)}
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
  const highlights = useHighlights();
  const turnActive = useIsTurn(isOpponent);

  const isCurrentTurn = useMemo(
    () => state.turnPlayer.id === id,
    [id, state.turnPlayer],
  );

  const isVictor = useMemo(
    () => state.action === 'finish' && results.winner?.id === id,
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
      className={[
        isOpponent ? 'opponent' : 'player',
        highlights.targeted.includes(id) && 'user-targeted',
      ].filter(Boolean).join(' ')}
      container
      data-user-id={id}
      justifyContent="space-between"
      overflow="hidden"
      position="relative"
      sx={{
        border: {
          sm: `1px solid ${turnActive ? 'rgb(255, 255, 0)' : 'var(--bgcolor)'}`,
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
          active={highlights.effectNames.includes(id)}
          name={user.name}
          soul={user.class}
        />
        <Artifacts
          active={highlights.effectArtifacts.includes(id)}
          artifacts={artifacts}
          isOpponent={isOpponent}
          playerId={id}
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
        alignItems="center"
        className="player-info"
        container
        flexGrow={0}
        wrap="nowrap"
      >
        <Stat alt="deck" image="cards" tip="replay.deck" value={deck} />
        <Stat
          alt="hand"
          image="hand"
          tip="replay.hand"
          value={(
            <>
              {hand}
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>/7</Box>
            </>
)}
        />
        <Stat alt="gold" image="gold" tip="replay.gold" value={gold} />
      </Flex>
    </Flex>
  );
}

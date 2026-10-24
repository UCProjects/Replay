import { MouseEvent, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useTranslation } from '~/hooks/useTranslation';
import { GameRecord } from '~/structures/GameRecord';
import { User } from '~/types/user';
import { MODE } from '~/types/game';
import { FavoriteButton } from '~/components/FavoriteButton';
import { Link } from '~/components/Link';
import { fightParams, playerParams } from '~/routes/Home/searchQuery';
import { FocusQuery, focusLast } from '~/utils/focusUser';
import { storyFightOf } from '~/utils/storyFight';

import './style.css';

export type EntryProps = {
  focus?: FocusQuery;
  record: GameRecord;
};

type UserDataProps = {
  user: User,
  opponent?: boolean,
  ranked?: boolean,
};

function UserData({
  user: {
    id,
    name,
    class: soul,
    level,
    rank,
  },
  opponent = false,
  ranked = false,
}: UserDataProps): ReactNode {
  const navigate = useNavigate();
  const displayName = useDisplayName();
  const fight = storyFightOf(name);
  const handleSearch = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const params = fight ? fightParams(fight) : playerParams({ id, name });
    navigate({ pathname: '/', search: params.toString() });
  }, [
    fight,
    id,
    name,
    navigate,
  ]);

  return (
    <Box
      alignItems="center"
      className={opponent ? 'opponent' : 'player'}
      data-rank={ranked ? rank.substring(0, 1) : undefined}
      display="flex"
      flex={1}
      overflow="hidden"
      sx={{
        '&[data-rank]::before': { margin: '0 5px 0 0' },
      }}
    >
      <Typography
        className="user"
        component="span"
        data-level={level}
        data-soul={soul}
      >
        {displayName(name)}
      </Typography>
      {(id !== 0 || fight) && (
      <IconButton
        aria-label={`Search games with ${displayName(name)}`}
        component="span"
        onClick={handleSearch}
        size="small"
        sx={{
          color: 'inherit',
          marginLeft: 'auto',
          opacity: 0.6,
          ':hover': { opacity: 1 },
        }}
        title={`Search games with ${displayName(name)}`}
      >
        <Search fontSize="inherit" />
      </IconButton>
      )}
    </Box>
  );
}

const subgrid = {
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
};

export default function Entry({
  focus = undefined,
  record: {
    date,
    key,
    start,
    type,
    users,
  },
}: EntryProps): ReactNode {
  const t = useTranslation();
  const [opponent, player] = focusLast(users, focus);
  // TODO: Tippy
  const ranked = MODE[type] === MODE.RANKED;
  return (
    <>
      <Divider sx={{ gridColumn: '1 / -1', marginY: 0.5 }} />
      <Link
        style={subgrid}
        to={`/game/${key}/`}
      >
        <Stack
          data-date={date}
          data-start={start}
          sx={subgrid}
        >
          <Stack
            direction={{ sm: 'row-reverse', xs: 'column' }}
            minWidth={0}
          >
            <UserData
              opponent
              ranked={ranked}
              user={opponent}
            />
            <UserData
              ranked={ranked}
              user={player}
            />
          </Stack>
          <Box
            sx={{
              alignItems: 'center',
              alignSelf: 'center',
              display: 'flex',
              gap: '4px',
              justifyContent: 'center',
              paddingX: '10px',
            }}
          >
            <Typography component="span">
              [
              {t(`game-type-${type.toLowerCase()}`, { fallback: type })}
              ]
            </Typography>
            <FavoriteButton game={key} />
          </Box>
        </Stack>
      </Link>
    </>
  );
}

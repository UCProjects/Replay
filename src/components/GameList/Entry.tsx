import { ReactNode } from 'react';
import {
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from '~/hooks/useTranslation';
import { GameRecord } from '~/structures/GameRecord';
import { User } from '~/types/user';
import { MODE } from '~/types/game';
import { Link } from '~/components/Link';

import './style.css';

export type EntryProps = {
  record: GameRecord;
};

type UserDataProps = {
  user: User,
  opponent?: boolean,
  ranked?: boolean,
};

function UserData({
  user: {
    name,
    class: soul,
    level,
    rank,
  },
  opponent = false,
  ranked = false,
}: UserDataProps): ReactNode {
  return (
    <Box
      alignContent="center"
      className={opponent ? 'opponent' : 'player'}
      data-rank={ranked ? rank.substring(0, 1) : undefined}
      flex={1}
      overflow="hidden"
    >
      <Typography
        className="user"
        component="span"
        data-level={level}
        data-soul={soul}
      >
        {name}
      </Typography>
    </Box>
  );
}

const subgrid = {
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
};

export default function Entry({
  record: {
    date,
    key,
    start,
    type,
    users: [
      opponent,
      player,
    ],
  },
}: EntryProps): ReactNode {
  const t = useTranslation();
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
          <Typography
            component="span"
            sx={{
              textAlign: 'center',
              minWidth: { sm: '200px', xs: 0 },
              paddingX: '10px',
              alignSelf: 'center',
            }}
          >
            [
            {t(`game-type-${type.toLowerCase()}`, { fallback: type })}
            ]
          </Typography>
        </Stack>
      </Link>
    </>
  );
}

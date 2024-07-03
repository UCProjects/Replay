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
import Link from '../Link';

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

export default function Entry({
  record: {
    date,
    key,
    start,
    type,
    users: [
      player,
      opponent,
    ],
  },
}: EntryProps): ReactNode {
  const t = useTranslation();
  // TODO: Tippy
  const ranked = MODE[type] === MODE.RANKED;
  return (
    <>
      <Divider />
      <Link
        to={`/game/${key}/`}
      >
        <Stack
          data-date={date}
          data-start={start}
          direction="row"
        >
          <UserData
            ranked={ranked}
            user={player}
          />
          <UserData
            opponent
            ranked={ranked}
            user={opponent}
          />
          <Typography
            component="span"
            sx={{
              textAlign: 'center',
              flexBasis: '200px',
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

import { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { GameRecord } from '../../structures/GameRecord';
import { User } from '../../types/user';
import { MODE } from '../../types/game';
import Link from '../Link';

import './style.css';

type UserDataProps = {
  user: User,
  opponent?: boolean,
  ranked?: boolean,
};

// TODO: UserRank, UserName

function UserData({
  user: {
    name,
    class: soul,
    rank,
  },
  opponent = false,
  ranked = false,
}: UserDataProps): ReactNode {
  return (
    <Box
      className={opponent ? 'opponent' : 'player'}
      flex={1}
    >
      {ranked && <Typography component="span">{rank.substring(0, 1)}</Typography>}
      <span className={soul}>{name}</span>
    </Box>
  );
}

export type EntryProps = {
  record: GameRecord;
};

export default function Entry({
  record: {
    date: _date,
    key,
    type,
    users: [
      player,
      opponent,
    ],
  },
}: EntryProps): ReactNode {
  // TODO: Tippy, translation
  const ranked = MODE[type] === MODE.RANKED;
  return (
    <Link
      to={`/game/${key}`}
    >
      <Stack
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
        <Box
          sx={{
            textAlign: 'right',
            flexBasis: '120px',
          }}
        >
          [
          {type}
          ]
        </Box>
      </Stack>
    </Link>
  );
}

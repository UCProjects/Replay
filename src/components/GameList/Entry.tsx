import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { GameRecord } from '../../structures/GameRecord';
import { User } from '../../types/user';
import { MODE } from '../../types/game';
import Link from '../Link';

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
  },
  opponent = false,
  ranked = false,
}: UserDataProps): ReactNode {
  return (
    <Box
      className={opponent ? 'opponent' : 'player'}
    >
      {ranked && <Box />}
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
  // TODO: Tippy, link... translation
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
            width: 200,
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

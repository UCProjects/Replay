import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { GameRecord } from '../../structures/GameRecord';
import { User } from '../../types/user';
import { GAME_MODE } from '../../types/game';

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
      direction="row"
    >
      {ranked && <Box />}
      <span className={soul}>{name}</span>
    </Box>
  );
}

export default function Entry({
  date: _date,
  key,
  type,
  users: [
    player,
    opponent,
  ],
}: GameRecord): ReactNode {
  // TODO
  const ranked = GAME_MODE[type] === GAME_MODE.RANKED;
  return (
    <Stack key={key}>
      <UserData
        ranked={ranked}
        user={player}
      />
      <UserData
        opponent
        ranked={ranked}
        user={opponent}
      />
    </Stack>
  );
}

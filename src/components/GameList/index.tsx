import { Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ReactNode, useMemo } from 'react';
import { GameRecord } from '../../structures/GameRecord';
import Entry from './Entry';
import Flex from '../Flex';

export type GameListParams = {
  title?: string;
  entries?: GameRecord[];
};

// TODO: Allow passing in game entries
export default function GameList({
  title = '',
  entries = [],
}: GameListParams): ReactNode {
  const list = useMemo(
    () => {
      if (!entries.length) {
        return 'Loading, please wait...';
      }
      return entries.map((entry) => <Entry entry={entry} />);
    },
    [entries],
  );
  return (
    <Box>
      <Flex container>
        <span>
          {title}
          :&nbsp;
        </span>
        <Refresh />
      </Flex>
      {list}
    </Box>
  );
}

import { Box, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { ReactNode, useCallback, useMemo } from 'react';
import { GameRecords } from '~/structures/GameRecord';
import { useTranslation } from '~/hooks/useTranslation';
import Entry from './Entry';
import Flex from '../Flex';
import { PagedList } from '../PagedList';

export type GameListParams = {
  title?: string;
  entries?: GameRecords;
  onRefresh?: () => void;
};

export default function GameList({
  title = '',
  entries = [],
  onRefresh = undefined,
}: GameListParams): ReactNode {
  const t = useTranslation();
  const list = useMemo(
    () => entries.map((entry) => (
      <Entry
        key={entry.key}
        record={entry}
      />
    )),
    [entries],
  );
  // TODO: Ignore tab events
  const handleClick = useCallback(() => {
    onRefresh?.();
  }, [
    onRefresh,
  ]);
  return (
    <Box
      sx={{
        flexGrow: '1',
        textAlign: 'left',
        paddingX: '5px',
      }}
    >
      <Flex
        container
        sx={{
          height: 40,
          alignContent: 'center',
        }}
      >
        <span>
          {title}
          :&nbsp;
        </span>
        <IconButton
          disableRipple
          onClick={handleClick}
          onKeyUp={handleClick}
          sx={{
            border: '1px solid black',
            color: 'inherit',
            minWidth: 0,
            padding: 0,
            ':focus-visible': {
              borderColor: 'white',
            },
          }}
        >
          <Refresh />
        </IconButton>
      </Flex>
      <PagedList
        component={Box}
        emptyMessage={t('replay-loading')}
        items={list}
        itemsPerPage={20}
      />
    </Box>
  );
}

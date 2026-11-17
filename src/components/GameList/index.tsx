import { Box, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Flex } from '~/components/Flex';
import { Paginator } from '~/components/Paginator';
import { GameRecords } from '~/structures/GameRecord';
import { useTranslation } from '~/hooks/useTranslation';
import { FocusQuery } from '~/utils/focusUser';
import Entry from './Entry';

const REFRESH_COOLDOWN_MS = 10_000;

export type GameListParams = {
  title?: string;
  entries?: GameRecords;
  emptyMessage?: ReactNode;
  focus?: FocusQuery;
  onRefresh?: () => void;
};

export default function GameList({
  title = '',
  entries = [],
  emptyMessage = undefined,
  focus = undefined,
  onRefresh = undefined,
}: GameListParams): ReactNode {
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useTranslation();
  const list = useMemo(
    () => entries.map((entry) => (
      <Entry
        focus={focus}
        key={entry.key}
        record={entry}
      />
    )),
    [entries, focus],
  );
  const [coolingDown, setCoolingDown] = useState(false);
  const cooling = useRef(false);
  useEffect(() => {
    if (!coolingDown) return undefined;
    const timer = setTimeout(() => {
      cooling.current = false;
      setCoolingDown(false);
    }, REFRESH_COOLDOWN_MS);
    return () => clearTimeout(timer);
  }, [coolingDown]);
  const handleClick = useCallback(() => {
    if (cooling.current) return;
    cooling.current = true;
    setCoolingDown(true);
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
        alignItems="center"
        container
        justifyContent="space-between"
        sx={{
          height: 40,
          alignContent: 'center',
        }}
      >
        <Flex>
          <span>
            {title}
            :&nbsp;
          </span>
          <IconButton
            aria-label="Refresh"
            disabled={coolingDown}
            disableRipple
            onClick={handleClick}
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
        <Flex ref={ref} />
      </Flex>
      <Paginator
        component={Box}
        componentProps={{
          sx: {
            display: 'grid',
            gridTemplateColumns: '1fr auto',
          },
        }}
        emptyMessage={emptyMessage ?? t('replay-loading')}
        items={list}
        itemsPerPage={20}
        paginateTopRef={ref}
      />
    </Box>
  );
}

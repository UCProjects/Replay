import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Tab,
  Tabs,
  Theme,
} from '@mui/material';

import { Flex } from '~/components/Flex.tsx';
import GameList from '~/components/GameList/index.tsx';
import { GameRecords } from '~/structures/GameRecord.ts';
import { useLoadLanguage } from '~/hooks/useTranslation.ts';
import Footer from './components/Footer.tsx';
import Navigation from './components/Navigation';
import searchRecent, { cachedRecent } from './searchRecent.ts';
import Search from './components/Navigation/Search.tsx';
import SearchResults from './SearchResults.tsx';
import {
  hasQuery,
  parseQuery,
  SearchQuery,
  toParams,
} from './searchQuery.ts';

function RecentGames(): ReactNode {
  const [entries, setEntries] = useState<GameRecords>(cachedRecent);
  const [loaded, setLoaded] = useState(() => entries.length > 0);
  const [refresh, setRefresh] = useState(false);
  const loadLanguage = useLoadLanguage();
  // TODO: Add refresh cooldown

  useEffect(() => {
    if (!refresh) return;
    (async () => {
      try {
        const games = await searchRecent();
        // This could benefit from `useEffectEvent`
        if (games.length) {
          loadLanguage(games[0].translation);
        }
        setEntries(games);
      } finally {
        setLoaded(true);
        setRefresh(false);
      }
    })();
  }, [
    loadLanguage,
    refresh,
  ]);

  useEffect(() => {
    if (entries.length) loadLanguage(entries[0].translation);
    setRefresh(true);
    // Only on mount: show what is cached, then look for newer games
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(() => setRefresh(true), []);

  return (
    <GameList
      emptyMessage={loaded ? 'No recent games' : undefined}
      entries={entries}
      onRefresh={handleRefresh}
      title="Recent Games"
    />
  );
}

const TAB_SX = (theme: Theme) => ({
  minHeight: 0,
  borderBottom: '1px solid rgba(255, 255, 255, 0.6)',
  '& .MuiTab-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid transparent',
    borderBottom: 0,
    borderRadius: '6px 6px 0 0',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '-1px',
    marginRight: '4px',
    minHeight: 0,
    minWidth: 0,
    paddingY: '6px',
    textTransform: 'none',
  },
  '& .MuiTab-root.Mui-selected': {
    backgroundColor: theme.palette.background.default,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    color: 'var(--font)',
    paddingBottom: '7px',
  },
});

type TabName = 'home' | 'search';

export default function Home(): ReactNode {
  const { key } = useLocation();
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => parseQuery(params), [params]);
  const searching = hasQuery(query);
  const [tab, setTab] = useState<TabName>(searching ? 'search' : 'home');

  useEffect(() => {
    if (searching) setTab('search');
  }, [
    key,
    searching,
  ]);

  const handleTab = useCallback((_event: unknown, value: TabName) => setTab(value), []);

  const handleSearch = useCallback((next: SearchQuery) => {
    setParams(toParams(next));
  }, [setParams]);

  return (
    <Box>
      <Flex
        alignContent="flex-start"
        alignItems="flex-start"
        container
        disableEqualOverflow
        sx={{
          overflowX: 'auto',
        }}
      >
        <Flex
          sx={{
            maxWidth: {
              md: '200px',
              xs: '100%',
            },
          }}
          xs={12}
        >
          <Navigation />
        </Flex>
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Tabs
            onChange={handleTab}
            sx={TAB_SX}
            TabIndicatorProps={{ sx: { display: 'none' } }}
            value={tab}
          >
            <Tab label="Home" value="home" />
            <Tab aria-label="Search" label={<SearchIcon fontSize="small" />} value="search" />
          </Tabs>
          <Box sx={{ display: tab === 'home' ? 'flex' : 'none' }}>
            <RecentGames />
          </Box>
          <Box sx={{ display: tab === 'search' ? 'block' : 'none' }}>
            <Search
              onSearch={handleSearch}
              query={query}
            />
            {searching && <SearchResults query={query} />}
          </Box>
        </Box>
      </Flex>
      <Flex
        alignItems="center"
        component="footer"
        container
        justifyContent="space-evenly"
        sx={(theme) => ({
          display: {
            xs: 'flex',
            md: 'none',
          },
          position: 'sticky',
          backgroundColor: theme.palette.background.default,
          bottom: 0,
        })}
        xs={12}
      >
        <Footer />
      </Flex>
    </Box>
  );
}

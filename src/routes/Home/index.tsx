import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Favorite,
  HelpOutline,
  Search as SearchIcon,
  Storefront,
} from '@mui/icons-material';
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
import { usePageTitle } from '~/hooks/usePageTitle';
import { useUser } from '~/hooks/useUser';
import About from './About.tsx';
import FavoriteGames from './FavoriteGames.tsx';
import {
  initialTab,
  recall,
  remember,
  TAB_PATHS,
  TabName,
  tabOfPath,
} from './rememberedTab.ts';
import Footer from './components/Footer.tsx';
import Navigation from './components/Navigation';
import searchRecent, { cachedRecent } from './searchRecent.ts';
import Search from './components/Navigation/Search.tsx';
import SearchResults from './SearchResults.tsx';
import Shop from './Shop.tsx';
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

const PUSH_RIGHT = { marginLeft: 'auto' };

const TAB_TITLES: Record<TabName, string | undefined> = {
  favorites: 'Favorites',
  home: undefined,
  info: 'Information',
  search: 'Search',
  shop: 'Shop',
};

export default function Home(): ReactNode {
  const { key, pathname, search } = useLocation();
  const navigate = useNavigate();
  const mountKey = useRef(key);
  const [memory] = useState(recall);
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => parseQuery(params), [params]);
  const searching = hasQuery(query);
  const user = useUser();
  const [selected, setTab] = useState<TabName>(() => {
    const initial = initialTab(searching, search, memory);
    return TAB_PATHS[initial] ? 'home' : initial;
  });
  const pathTab = tabOfPath(pathname);
  const shown = pathTab ?? selected;
  const tab = shown === 'favorites' && !user ? 'home' : shown;
  usePageTitle(TAB_TITLES[tab]);

  useEffect(() => {
    const remembered = memory.tab && TAB_PATHS[memory.tab];
    if (!pathTab && !searching && remembered) {
      navigate(remembered, { replace: true });
    } else if (!pathTab && !searching && memory.tab === 'search' && memory.search) {
      setParams(new URLSearchParams(memory.search), { replace: true });
    }
    // Only on mount: come back to the tab or search that was open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathTab) remember({ tab: pathTab });
  }, [pathTab]);

  useEffect(() => {
    if (!searching) return;
    remember({ search });
    if (key !== mountKey.current) {
      setTab('search');
      remember({ tab: 'search' });
    }
  }, [
    key,
    search,
    searching,
  ]);

  const handleTab = useCallback((_event: unknown, value: TabName) => {
    remember({ tab: value });
    const path = TAB_PATHS[value];
    if (path) {
      navigate(path);
      return;
    }
    setTab(value);
    const saved = recall().search;
    if (pathTab) {
      navigate({ pathname: '/', search: value === 'search' ? saved : '' });
      return;
    }
    if (value === 'search' && !searching && saved) {
      setParams(new URLSearchParams(saved), { replace: true });
    }
  }, [navigate, pathTab, searching, setParams]);

  const handleShop = useCallback(() => handleTab(undefined, 'shop'), [handleTab]);

  const handleSearch = useCallback((next: SearchQuery) => {
    if (!hasQuery(next)) remember({ search: '' });
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
          <Navigation onShop={handleShop} />
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
            {user && (
              <Tab
                aria-label="Favorites"
                label={<Favorite fontSize="small" />}
                sx={PUSH_RIGHT}
                value="favorites"
              />
            )}
            <Tab
              aria-label="Shop"
              label={<Storefront fontSize="small" />}
              sx={user ? undefined : PUSH_RIGHT}
              value="shop"
            />
            <Tab aria-label="Information" label={<HelpOutline fontSize="small" />} value="info" />
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
          {tab === 'shop' && <Shop />}
          {tab === 'info' && <About />}
          {tab === 'favorites' && (
            <Box sx={{ display: 'flex' }}>
              <FavoriteGames />
            </Box>
          )}
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
        <Footer onShop={handleShop} />
      </Flex>
    </Box>
  );
}

import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Box } from '@mui/material';

import Flex from '~/components/Flex.tsx';
import GameList from '~/components/GameList/index.tsx';
import { GameRecords } from '~/structures/GameRecord.ts';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Navigation from './components/Navigation/index.tsx';
import './home.css';
import searchRecent from './searchRecent.ts';

const initialSearch = searchRecent();

function RecentGames(): ReactNode {
  const [entries, setEntries] = useState<GameRecords>([]);
  const [refresh, setRefresh] = useState(false);
  // TODO: Add refresh cooldown

  useEffect(() => {
    initialSearch.then(setEntries);
  }, []);

  useEffect(() => {
    if (!refresh) return;
    (async () => {
      try {
        const games = await searchRecent();
        setEntries(games);
      } finally {
        setRefresh(false);
      }
    })();
  }, [
    refresh,
  ]);

  const handleRefresh = useCallback(() => setRefresh(true), []);

  return (
    <GameList
      entries={entries}
      onRefresh={handleRefresh}
      title="Recent Games"
    />
  );
}

export default function Home(): ReactNode {
  return (
    <Box>
      <Header />
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
          md="auto"
          xs={12}
        >
          <Navigation />
        </Flex>
        <RecentGames />
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

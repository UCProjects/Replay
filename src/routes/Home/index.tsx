import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Box } from '@mui/material';

import { Flex } from '~/components/Flex.tsx';
import GameList from '~/components/GameList/index.tsx';
import { GameRecords } from '~/structures/GameRecord.ts';
import { useLoadLanguage } from '~/hooks/useTranslation.ts';
import Footer from './components/Footer.tsx';
import Navigation from './components/Navigation';
import searchRecent from './searchRecent.ts';

function RecentGames(): ReactNode {
  const [entries, setEntries] = useState<GameRecords>([]);
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
        setRefresh(false);
      }
    })();
  }, [
    loadLanguage,
    refresh,
  ]);

  useEffect(() => setRefresh(true), []);

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

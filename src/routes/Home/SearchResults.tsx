import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Typography } from '@mui/material';

import GameList from '~/components/GameList/index.tsx';
import { GameRecords } from '~/structures/GameRecord.ts';
import { useLoadLanguage } from '~/hooks/useTranslation.ts';
import search from '~/managers/search.ts';
import { SearchQuery } from './searchQuery.ts';

const RESULT_LIMIT = 100;

export type SearchResultsProps = {
  query: SearchQuery;
};

export default function SearchResults({
  query,
}: SearchResultsProps): ReactNode {
  const [entries, setEntries] = useState<GameRecords>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(true);
  const loadLanguage = useLoadLanguage();

  useEffect(() => {
    setRefresh(true);
  }, [query]);

  useEffect(() => {
    if (!refresh) return undefined;
    let current = true;
    setLoaded(false);
    (async () => {
      try {
        const games = await search({
          ...query,
          id: query.id || '0',
          limit: RESULT_LIMIT,
        });
        if (!current) return;
        if (games.length) loadLanguage(games[0].translation);
        setEntries(games);
        setError('');
      } catch (e) {
        if (!current) return;
        setEntries([]);
        setError(e instanceof Error ? e.message : 'The search failed');
      } finally {
        if (current) {
          setLoaded(true);
          setRefresh(false);
        }
      }
    })();
    return () => {
      current = false;
    };
  }, [
    loadLanguage,
    query,
    refresh,
  ]);

  const handleRefresh = useCallback(() => setRefresh(true), []);

  return (
    <>
      {error && (
        <Typography color="error" paddingX="5px">
          {error}
        </Typography>
      )}
      <GameList
        emptyMessage={loaded ? 'No games found' : undefined}
        entries={entries}
        onRefresh={handleRefresh}
        title="Search Results"
      />
    </>
  );
}

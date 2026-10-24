import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import GameList from '~/components/GameList/index.tsx';
import { useFavorites } from '~/hooks/useFavorites';
import { useLoadLanguage } from '~/hooks/useTranslation.ts';
import { get } from '~/managers/search.ts';
import { GameRecord, GameRecords } from '~/structures/GameRecord.ts';

export default function FavoriteGames(): ReactNode {
  const { games } = useFavorites();
  const [entries, setEntries] = useState<GameRecords>([]);
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const loadLanguage = useLoadLanguage();

  useEffect(() => {
    setRefresh(true);
  }, [games]);

  useEffect(() => {
    if (!refresh) return undefined;
    let current = true;
    (async () => {
      const results = await Promise.allSettled([...games].reverse().map((key) => get(key)));
      if (!current) return;
      const records = results
        .filter((result): result is PromiseFulfilledResult<GameRecord> => result.status === 'fulfilled')
        .map(({ value }) => value);
      if (records.length) loadLanguage(records[0].translation);
      setEntries(records);
      setLoaded(true);
      setRefresh(false);
    })();
    return () => {
      current = false;
    };
  }, [games, loadLanguage, refresh]);

  const handleRefresh = useCallback(() => setRefresh(true), []);

  return (
    <GameList
      emptyMessage={loaded ? 'No favorites yet' : undefined}
      entries={entries}
      onRefresh={handleRefresh}
      title="Favorites"
    />
  );
}

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import GameList from '~/components/GameList/index.tsx';
import { useFavorites } from '~/hooks/useFavorites';
import { useLoadLanguage } from '~/hooks/useTranslation.ts';
import { favoriteRecord, forgetOtherRecords } from '~/managers/favorites.ts';
import { GameRecord, GameRecords } from '~/structures/GameRecord.ts';

export default function FavoriteGames(): ReactNode {
  const { games, ready, reload } = useFavorites();
  const fresh = useRef(false);
  const [entries, setEntries] = useState<GameRecords>([]);
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const loadLanguage = useLoadLanguage();

  useEffect(() => {
    setRefresh(true);
  }, [games]);

  useEffect(() => {
    if (!refresh || !ready) return undefined;
    let current = true;
    (async () => {
      const results = await Promise.allSettled(
        [...games].reverse().map((key) => favoriteRecord(key, { fresh: fresh.current })),
      );
      fresh.current = false;
      if (!current) return;
      if (games.length) forgetOtherRecords(games);
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
  }, [games, loadLanguage, ready, refresh]);

  const handleRefresh = useCallback(() => {
    fresh.current = true;
    reload()
      .catch(() => undefined)
      .finally(() => setRefresh(true));
  }, [reload]);

  return (
    <GameList
      emptyMessage={loaded ? 'No favorites yet' : undefined}
      entries={entries}
      onRefresh={handleRefresh}
      title="Favorites"
    />
  );
}

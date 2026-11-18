import { Snackbar } from '@mui/material';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoginDialog } from '~/components/LoginDialog';
import { FavoritesContext } from '~/hooks/useFavorites';
import { useUser } from '~/hooks/useUser';
import { fetchFavorites, setFavorite } from '~/managers/favorites';

const MESSAGE_MS = 4000;

export default function FavoritesProvider({ children }: PropsWithChildren): ReactNode {
  const user = useUser();
  const uid = user?.uid;
  const [games, setGames] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setGames([]);
    setReady(false);
    if (!uid) return undefined;
    let current = true;
    fetchFavorites(uid)
      .then((list) => {
        if (current) setGames(list);
      })
      .catch((error) => {
        if (current) setMessage(error instanceof Error ? error.message : 'Could not load your favorites');
      })
      .finally(() => {
        if (current) setReady(true);
      });
    return () => {
      current = false;
    };
  }, [uid]);

  const toggle = useCallback(async (game: string): Promise<boolean> => {
    if (!uid) {
      setLoginOpen(true);
      return false;
    }
    try {
      setGames(await setFavorite(uid, game, !games.includes(game)));
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not update your favorites');
      return false;
    }
  }, [games, uid]);

  const reload = useCallback(async (): Promise<void> => {
    if (uid) setGames(await fetchFavorites(uid, { fresh: true }));
  }, [uid]);

  const value = useMemo(() => ({
    games,
    isFavorite: (game: string) => games.includes(game),
    ready,
    reload,
    toggle,
  }), [games, ready, reload, toggle]);

  const handleCloseLogin = useCallback(() => setLoginOpen(false), []);
  const handleCloseMessage = useCallback(() => setMessage(''), []);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <LoginDialog onClose={handleCloseLogin} open={loginOpen} />
      <Snackbar
        autoHideDuration={MESSAGE_MS}
        message={message}
        onClose={handleCloseMessage}
        open={Boolean(message)}
      />
    </FavoritesContext.Provider>
  );
}

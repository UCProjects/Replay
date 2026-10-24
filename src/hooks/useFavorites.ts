import { createContext } from 'react';
import { useContent } from '~/hooks/useContent';

export type FavoritesContent = {
  games: string[];
  isFavorite: (game: string) => boolean;
  ready: boolean;
  reload: () => Promise<void>;
  toggle: (game: string) => Promise<boolean>;
};

export const FavoritesContext = createContext<FavoritesContent | null>(null);

export function useFavorites(): FavoritesContent {
  return useContent(FavoritesContext);
}

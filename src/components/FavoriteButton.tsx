import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { MouseEvent, ReactNode, useCallback } from 'react';
import { useFavorites } from '~/hooks/useFavorites';

export type FavoriteButtonProps = {
  game: string;
};

export function FavoriteButton({ game }: FavoriteButtonProps): ReactNode {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(game);
  const label = favorite ? 'Remove from favorites' : 'Add to favorites';

  const handleClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(game).catch(() => undefined);
  }, [game, toggle]);

  return (
    <IconButton
      aria-label={label}
      aria-pressed={favorite}
      component="span"
      onClick={handleClick}
      size="small"
      sx={{
        color: favorite ? '#bf3989' : 'inherit',
        opacity: favorite ? 1 : 0.6,
        ':hover': { opacity: 1 },
      }}
      title={label}
    >
      {favorite ? <Favorite fontSize="inherit" /> : <FavoriteBorder fontSize="inherit" />}
    </IconButton>
  );
}

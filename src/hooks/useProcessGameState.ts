import { useCallback } from 'react';
import { LoadedGame, expand } from '~/structures/LoadedGame';
import { GameState } from '~/types/game';

export function useProcessGameState(game: LoadedGame) {
  return useCallback((state: GameState) => {
    const expanded = expand(state, game.cache);
    expanded.players.forEach((acc) => {
      const user = game.getUser(acc.id);
      acc.user = user;
      acc.isOpponent = user === game.users[1];
    });
    return expanded;
  }, [game]);
}

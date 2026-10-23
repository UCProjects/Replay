import { useCallback } from 'react';
import { LoadedGame, expand } from '~/structures/LoadedGame';
import { GameBoard, GameState, GameStateExpanded } from '~/types/game';

export function useProcessGameState(game: LoadedGame) {
  return useCallback((state: GameState) => {
    const expanded = expand(state, game.cache);
    expanded.board = Array.from(
      { length: 8 },
      (_, i) => expanded.board?.[i] ?? null,
    ) as GameBoard;
    expanded.slots = Array.from(
      { length: 8 },
      (_, i) => expanded.slots?.[i] ?? null,
    ) as GameStateExpanded['slots'];
    expanded.players.forEach((acc) => {
      acc.id ??= 0;
      const user = game.getUser(acc.id);
      acc.user = user;
      acc.isOpponent = user === game.users[0];
    });
    return expanded;
  }, [game]);
}

import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLoaderData } from 'react-router-dom';
import { GameContext } from '~/hooks/useGame';
import { LoadedGame, expand } from '~/structures/LoadedGame';
import { GameState, GameStateExpanded } from '~/types/game';

export type LoaderDataType = [LoadedGame, string];

export function GameProvider({ children }: PropsWithChildren): ReactNode {
  const [[game, step]] = useState<LoaderDataType>(useLoaderData() as LoaderDataType);

  const processGameState = useCallback((state: GameStateExpanded) => {
    state.players.forEach((acc) => {
      acc.user = game.getUser(acc.id);
    });
    return state;
  }, [game]);

  const initialState = processGameState(expand(game.index[0], game.cache));
  const [gameState, setGameState] = useState<GameStateExpanded>(initialState);

  const handleSetGameState = useCallback((newState: GameState) => {
    setGameState((prev) => {
      if (prev?.id === newState.id) return prev;
      const expanded = expand(newState, game.cache);
      return processGameState(expanded);
    });
  }, [game.cache, processGameState]);

  useEffect(() => {
    const id = Number(step) || 0;
    handleSetGameState(game.index[id]);
  }, [
    game,
    handleSetGameState,
    step,
  ]);

  const content = useMemo(() => ({
    game,
    gameState,
    setGameState: handleSetGameState,
  }), [
    game,
    gameState,
    handleSetGameState,
  ]);

  return (
    <GameContext.Provider value={content}>
      {children}
    </GameContext.Provider>
  );
}

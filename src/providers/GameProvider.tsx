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
import {
  GameState,
  GameStateExpanded,
  Slot,
} from '~/types/game';

export type LoaderDataType = [LoadedGame];

export function GameProvider({ children }: PropsWithChildren): ReactNode {
  const [[game]] = useState(useLoaderData() as LoaderDataType);
  const [activeSlot, setActiveSlot] = useState<Slot>(null);

  const processGameState = useCallback((state: GameStateExpanded) => {
    state.players.forEach((acc) => {
      const user = game.getUser(acc.id);
      acc.user = user;
      acc.isOpponent = user === game.users[1];
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
  }, [game, processGameState]);

  useEffect(
    () => handleSetGameState(game.index[0]),
    [game, handleSetGameState],
  );

  const content = useMemo(() => ({
    activeSlot,
    setActiveSlot,
    game,
    gameState,
    setGameState: handleSetGameState,
  }), [
    activeSlot,
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

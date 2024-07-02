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
import { useProcessGameState } from '~/hooks/useProcessGameState';
import { LoadedGame } from '~/structures/LoadedGame';
import {
  GameState,
  GameStateExpanded,
  Slot,
} from '~/types/game';

export type LoaderDataType = [LoadedGame];

export function GameProvider({ children }: PropsWithChildren): ReactNode {
  const [[game]] = useState(useLoaderData() as LoaderDataType);
  const processGameState = useProcessGameState(game);
  const [activeSlot, setActiveSlot] = useState<Slot>(null);
  const [gameState, setGameState] = useState<GameStateExpanded>(
    () => processGameState(game.index[0]),
  );
  const [playing, setPlaying] = useState(true);

  const handleSetGameState = useCallback((newState: GameState) => {
    setGameState((prev) => {
      if (prev?.id === newState.id) return prev;
      return processGameState(newState);
    });
  }, [processGameState]);

  useEffect(() => {
    // console.log(game);
  }, [game]);
  useEffect(() => {
    // console.log(gameState);
  }, [gameState]);

  const content = useMemo(() => ({
    activeSlot,
    setActiveSlot,
    game,
    gameState,
    setGameState: handleSetGameState,
    playing,
    setPlaying,
  }), [
    activeSlot,
    game,
    gameState,
    handleSetGameState,
    playing,
  ]);

  return (
    <GameContext.Provider value={content}>
      {children}
    </GameContext.Provider>
  );
}

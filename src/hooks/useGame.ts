import { createContext, useContext, useMemo } from 'react';
import { LoadedGame } from '~/structures/LoadedGame';
import { GameBoard, GameState, GameStateExpanded } from '~/types/game';

export type GameContent = {
  game: LoadedGame;
  gameState: GameStateExpanded;
  setGameState: (state: GameState) => void;
};

export const GameContext = createContext<GameContent | null>(null);

export function useGame(): LoadedGame {
  const { game } = useContext(GameContext) || {};
  if (!game) throw new Error('Used outside of provider');
  return useMemo(
    () => game,
    [game],
  );
}

export function useGameState(): GameStateExpanded {
  const { gameState } = useContext(GameContext) || {};
  if (!gameState) throw new Error('Used outside of provider');
  return gameState;
}

export function useSetGameState(): GameContent['setGameState'] {
  const { setGameState } = useContext(GameContext) || {};
  if (!setGameState) throw new Error('Used outside of provider');
  return setGameState;
}

export function useGameBoard(): GameBoard {
  const { gameState } = useContext(GameContext) || {};
  if (!gameState) throw new Error('Used outside of provider');
  return useMemo(
    () => gameState.board,
    [gameState.board],
  );
}

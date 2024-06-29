import { createContext, useContext, useMemo } from 'react';
import { LoadedGame } from '~/structures/LoadedGame';
import {
  GameBoard,
  GameState,
  GameStateExpanded,
  Slot,
} from '~/types/game';

export type GameContent = {
  activeSlot: Slot;
  game: LoadedGame;
  gameState: GameStateExpanded;
  setActiveSlot: (slot: Slot) => void;
  setGameState: (state: GameState) => void;
};

export const GameContext = createContext<GameContent | null>(null);

export function useGame(): LoadedGame {
  const { game } = useContext(GameContext) || {};
  if (!game) throw new Error('Used outside of provider');
  return game;
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

export function useActiveSlot(): Slot {
  const { activeSlot } = useContext(GameContext) || {};
  if (activeSlot === undefined) throw new Error('Used outside of provider');
  return activeSlot;
}

export function useSetActiveSlot(): GameContent['setActiveSlot'] {
  const { setActiveSlot } = useContext(GameContext) || {};
  if (setActiveSlot === undefined) throw new Error('Used outside of provider');
  return setActiveSlot;
}

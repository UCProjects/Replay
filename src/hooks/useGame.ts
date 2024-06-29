import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
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
  playing: boolean;
  setActiveSlot: (slot: Slot) => void;
  setGameState: (state: GameState) => void;
  setPlaying: (playing: boolean) => void;
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
  if (!setActiveSlot) throw new Error('Used outside of provider');
  return setActiveSlot;
}

export function usePlaying(): GameContent['playing'] {
  const { playing } = useContext(GameContext) || {};
  if (playing === undefined) throw new Error('Used outside of provider');
  return playing;
}

export function useSetPlaying(): GameContent['setPlaying'] {
  const { setPlaying } = useContext(GameContext) || {};
  if (!setPlaying) throw new Error('Used outside of provider');
  return setPlaying;
}

export function usePlay() {
  const setPlaying = useSetPlaying();
  return useCallback(
    () => setPlaying(true),
    [setPlaying],
  );
}

export function usePause() {
  const setPlaying = useSetPlaying();
  return useCallback(
    () => setPlaying(false),
    [setPlaying],
  );
}

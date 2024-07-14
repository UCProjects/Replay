import {
  createContext,
  useCallback,
  useMemo,
} from 'react';
import { LoadedGame } from '~/structures/LoadedGame';
import {
  GameBoard,
  GameState,
  GameStateExpanded,
  Slot,
} from '~/types/game';
import { useContent } from '~/hooks/useContent';

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
  const { game } = useContent(GameContext);
  return game;
}

export function useGameState(): GameStateExpanded {
  const { gameState } = useContent(GameContext);
  return gameState;
}

export function useSetGameState(): GameContent['setGameState'] {
  const { setGameState } = useContent(GameContext);
  return setGameState;
}

export function useGameBoard(): GameBoard {
  const { gameState } = useContent(GameContext);
  return useMemo(
    () => gameState.board,
    [gameState.board],
  );
}

export function useActiveSlot(): Slot {
  const { activeSlot } = useContent(GameContext);
  return activeSlot;
}

export function useSetActiveSlot(): GameContent['setActiveSlot'] {
  const { setActiveSlot } = useContent(GameContext);
  return setActiveSlot;
}

export function usePlaying(): GameContent['playing'] {
  const { playing } = useContent(GameContext);
  return playing;
}

export function useSetPlaying(): GameContent['setPlaying'] {
  const { setPlaying } = useContent(GameContext);
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

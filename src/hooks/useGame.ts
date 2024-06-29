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

function useGameContent(): GameContent {
  const context = useContext(GameContext);
  if (!context) throw new Error('Used outside of provider');
  return context;
}

export function useGame(): LoadedGame {
  const { game } = useGameContent();
  return game;
}

export function useGameState(): GameStateExpanded {
  const { gameState } = useGameContent();
  return gameState;
}

export function useSetGameState(): GameContent['setGameState'] {
  const { setGameState } = useGameContent();
  return setGameState;
}

export function useGameBoard(): GameBoard {
  const { gameState } = useGameContent();
  return useMemo(
    () => gameState.board,
    [gameState.board],
  );
}

export function useActiveSlot(): Slot {
  const { activeSlot } = useGameContent();
  return activeSlot;
}

export function useSetActiveSlot(): GameContent['setActiveSlot'] {
  const { setActiveSlot } = useGameContent();
  return setActiveSlot;
}

export function usePlaying(): GameContent['playing'] {
  const { playing } = useGameContent();
  return playing;
}

export function useSetPlaying(): GameContent['setPlaying'] {
  const { setPlaying } = useGameContent();
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

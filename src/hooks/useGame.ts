import {
  createContext,
  useMemo,
} from 'react';
import { LoadedGame } from '~/structures/LoadedGame';
import {
  GameBoard,
  GameStateExpanded,
  Slot,
} from '~/types/game';
import { useContent } from '~/hooks/useContent';
import { Timeline } from '~/utils/timeline';

export type GameContent = {
  activeSlot: Slot;
  commitScrub: () => void;
  eventState: GameStateExpanded;
  game: LoadedGame;
  gameState: GameStateExpanded;
  pause: () => void;
  play: () => void;
  playing: boolean;
  position: number;
  scrub: (time: number) => void;
  step: (direction: 1 | -1) => void;
  timeline: Timeline;
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

export function useEventState(): GameStateExpanded {
  const { eventState } = useContent(GameContext);
  return eventState;
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

export function usePlaying(): GameContent['playing'] {
  const { playing } = useContent(GameContext);
  return playing;
}

export function usePlay(): GameContent['play'] {
  const { play } = useContent(GameContext);
  return play;
}

export function usePause(): GameContent['pause'] {
  const { pause } = useContent(GameContext);
  return pause;
}

export type Playback = Pick<GameContent, 'commitScrub' | 'pause' | 'play' | 'playing' | 'scrub' | 'step'> & {
  elapsed: number;
  finished: boolean;
  total: number;
};

export function usePlayback(): Playback {
  const {
    commitScrub,
    game,
    pause,
    play,
    playing,
    position,
    scrub,
    step,
    timeline,
  } = useContent(GameContext);
  return {
    commitScrub,
    elapsed: timeline.starts[position] ?? 0,
    finished: position >= game.index.length - 1,
    pause,
    play,
    playing,
    scrub,
    step,
    total: timeline.total,
  };
}

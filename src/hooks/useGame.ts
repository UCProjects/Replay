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
import { Highlights } from '~/utils/highlights';
import { Timeline } from '~/utils/timeline';

export type GameContent = {
  activeSlot: Slot;
  commitScrub: () => void;
  eventState: GameStateExpanded;
  featuredArtifacts: Map<number, (number | undefined)[]>;
  game: LoadedGame;
  gameState: GameStateExpanded;
  highlights: Highlights;
  pause: () => void;
  pin: number | null;
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

export function useHighlights(): Highlights {
  const { highlights } = useContent(GameContext);
  return highlights;
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
    pin,
    play,
    playing,
    position,
    scrub,
    step,
    timeline,
  } = useContent(GameContext);
  return {
    commitScrub,
    elapsed: pin ?? timeline.starts[position] ?? 0,
    finished: position >= game.index.length - 1,
    pause,
    play,
    playing,
    scrub,
    step,
    total: timeline.total,
  };
}

export function useIsTurn(isOpponent: boolean): boolean {
  const { eventState, game, gameState } = useContent(GameContext);
  if (eventState.action === 'finish') return false;
  const opponentId = game.users[0].id;
  return (gameState.turnPlayer.id === opponentId) === isOpponent;
}

export function useFeaturedArtifact(playerId: number): number | undefined {
  const { featuredArtifacts, gameState } = useContent(GameContext);
  return featuredArtifacts.get(playerId)?.[gameState.id];
}

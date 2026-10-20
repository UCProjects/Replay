import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLoaderData } from 'react-router-dom';
import { GameContext } from '~/hooks/useGame';
import { useProcessGameState } from '~/hooks/useProcessGameState';
import { LoadedGame } from '~/structures/LoadedGame';
import { activeCardOf } from '~/utils/activeCard';
import {
  buildTimeline,
  findScene,
  stepScene,
} from '~/utils/timeline';

export type LoaderDataType = [LoadedGame];

export function GameProvider({ children }: PropsWithChildren): ReactNode {
  const [[game]] = useState(useLoaderData() as LoaderDataType);
  const processGameState = useProcessGameState(game);
  const timeline = useMemo(() => buildTimeline(game.index), [game]);
  const last = game.index.length - 1;

  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const shown = useDeferredValue(position);

  const gameState = useMemo(
    () => processGameState(game.index[shown]),
    [game, processGameState, shown],
  );
  const eventState = useMemo(() => {
    const index = timeline.event[shown];
    return index === shown ? gameState : processGameState(game.index[index]);
  }, [game, gameState, processGameState, shown, timeline]);
  const activeSlot = useMemo(() => activeCardOf(eventState), [eventState]);

  useEffect(() => {
    if (!playing || scrubbing) return undefined;
    if (position >= last) {
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(
      () => setPosition(position + 1),
      timeline.durations[position],
    );
    return () => window.clearTimeout(timer);
  }, [last, playing, position, scrubbing, timeline]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  const play = useCallback(() => {
    if (position >= last) setPosition(0);
    setPlaying(true);
  }, [last, position]);

  const pause = useCallback(() => setPlaying(false), []);

  const scrub = useCallback((time: number) => {
    setScrubbing(true);
    setPosition(findScene(timeline, time));
  }, [timeline]);

  const commitScrub = useCallback(() => setScrubbing(false), []);

  const step = useCallback((direction: 1 | -1) => {
    setPosition(stepScene(timeline, position, direction));
  }, [position, timeline]);

  const content = useMemo(() => ({
    activeSlot,
    commitScrub,
    eventState,
    game,
    gameState,
    pause,
    play,
    playing,
    position,
    scrub,
    step,
    timeline,
  }), [
    activeSlot,
    commitScrub,
    eventState,
    game,
    gameState,
    pause,
    play,
    playing,
    position,
    scrub,
    step,
    timeline,
  ]);

  return (
    <GameContext.Provider value={content}>
      {children}
    </GameContext.Provider>
  );
}

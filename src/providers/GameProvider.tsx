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
import { LoadedGame, expand } from '~/structures/LoadedGame';
import { Artifact, PlayerRaw } from '~/types/game';
import { activeCardOf } from '~/utils/activeCard';
import { featuredAcross } from '~/utils/featuredArtifact';
import { highlightsOf } from '~/utils/highlights';
import {
  buildTimeline,
  findScene,
  stepScene,
} from '~/utils/timeline';

type ArtifactHistory = (Artifact[] | undefined)[];

const PLAYING_SKIP_BACK = 1000;

export type LoaderDataType = [LoadedGame];

export function GameProvider({ children }: PropsWithChildren): ReactNode {
  const [[game]] = useState(useLoaderData() as LoaderDataType);
  const processGameState = useProcessGameState(game);
  const timeline = useMemo(() => buildTimeline(game.index), [game]);
  const last = game.index.length - 1;
  const featuredArtifacts = useMemo(() => {
    const lists = new Map<number, ArtifactHistory>();
    game.index.forEach((state, index) => {
      const players = (expand(state.players, game.cache) ?? []) as PlayerRaw[];
      players.forEach((player) => {
        const id = player.id ?? 0;
        const history = lists.get(id) ?? [];
        history[index] = player.artifacts;
        lists.set(id, history);
      });
    });
    return new Map(
      [...lists].map(([id, history]) => [id, featuredAcross(Array.from(history))]),
    );
  }, [game]);

  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [pin, setPin] = useState<number | null>(null);
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
  const highlights = useMemo(() => highlightsOf(eventState), [eventState]);

  useEffect(() => {
    if (!playing || scrubbing) return undefined;
    if (position >= last) {
      setPlaying(false);
      return undefined;
    }
    const end = timeline.starts[position] + timeline.durations[position];
    const timer = window.setTimeout(
      () => {
        setPin(null);
        setPosition(position + 1);
      },
      pin === null ? timeline.durations[position] : Math.max(end - pin, 0),
    );
    return () => window.clearTimeout(timer);
  }, [last, pin, playing, position, scrubbing, timeline]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);

  const play = useCallback(() => {
    if (position >= last) {
      setPin(null);
      setPosition(0);
    }
    setPlaying(true);
  }, [last, position]);

  const pause = useCallback(() => setPlaying(false), []);

  const scrub = useCallback((time: number) => {
    if (!Number.isFinite(time)) return;
    setScrubbing(true);
    setPin(time);
    setPosition(findScene(timeline, time));
  }, [timeline]);

  const commitScrub = useCallback(() => setScrubbing(false), []);

  const step = useCallback((direction: 1 | -1) => {
    setPin(null);
    setPosition(stepScene(timeline, position, direction, playing ? PLAYING_SKIP_BACK : 0));
  }, [playing, position, timeline]);

  const content = useMemo(() => ({
    activeSlot,
    commitScrub,
    eventState,
    featuredArtifacts,
    game,
    gameState,
    highlights,
    pause,
    pin,
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
    featuredArtifacts,
    game,
    gameState,
    highlights,
    pause,
    pin,
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

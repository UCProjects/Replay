import {
  Game,
  GameRaw,
  GameState,
  GameStateExpanded,
} from '~/types/game';
import { User } from '~/types/user';
import { GameRecord } from './GameRecord';

export type LoadedGame = GameRecord & Game;

const hash = /^[a-f0-9]{40}$/;

export function loadGame(record: GameRecord, data: GameRaw): LoadedGame {
  function getUser(userId: User['id']): User {
    return record.getUser(userId);
  }
  const index: GameState[] = data.index.map((state, id) => ({
    ...state,
    id,
    time: new Date(state.time),
    turnPlayer: getUser(state.turnPlayer),
  }));
  return {
    ...record,
    ...data,
    index,
    getUser,
  };
}

export function expand(obj: GameState, cache: GameRaw['cache']): GameStateExpanded;
export function expand(obj: unknown, cache: GameRaw['cache']): unknown;
export function expand(obj: unknown, cache: GameRaw['cache']): unknown {
  if (obj === null || obj === undefined) return null;
  if (
    typeof obj === 'number'
    || typeof obj === 'boolean'
    || obj instanceof Date
  ) return obj;

  if (typeof obj === 'string') {
    const isRef = obj.startsWith('###');
    if (isRef || hash.test(obj)) {
      const key = isRef ? obj.substring(3) : obj;
      return expand(cache[key], cache);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((val) => expand(val, cache));
  }

  if (typeof obj === 'object' && Object.keys(obj).length) {
    const o: Record<string, unknown> = {};
    Object.keys(obj).forEach((key) => {
      o[key] = expand(obj[key as keyof typeof obj], cache);
    });
    return o;
  }

  throw new Error(`Unknown data type: ${typeof obj}`);
}

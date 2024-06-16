import { Card } from './card';
import { User } from './user';

export type PlayerRaw = {
  id: User['id'];
  // TODO: Artifact structure
  artifacts: [];
  deck: number;
  hand: number;
  health: number;
  maxHealth: number;
  gold: number;
  lives?: number;
  dodge?: number;
};

export type Player = PlayerRaw & {
  user: User;
};

export type GameMode = keyof typeof MODE;

export type GameType = Exclude<GameMode, 'ANY'>;

export type GameResultTypes = 'game-end-lethal' | 'game-end-surrender' | 'game-end-disconnection' | 'game-end-chara' | 'timeout';

export type GameResult = {
  type: GameResultTypes;
  winner: User['id'];
};

export type Slot = Card | null;

export type GameBoard = Tuple<Slot, 8>;

type HASH = string;
type DateString = string;

export type GameStateRaw = {
  action: string;
  time: DateString;
  turn: number;
  turnPlayer: User['id'];
  players: HASH;
  board: HASH;
  extra: unknown;
};

export type GameState = Modify<GameStateRaw, {
  id: number;
  time: Date; // Convert to data
  turnPlayer: User; // Convert to user
}>;

export type GameStateExpanded = Modify<GameState, {
  board: GameBoard;
  players: Tuple<Player, 2>;
}>;

export type GameRaw = {
  cache: Record<HASH, unknown>;
  index: GameStateRaw[];
  players: Record<string, User>;
};

export type Game = Modify<GameRaw, {
  index: GameState[];
}>;

export const MODE = {
  ANY: 'Any',
  STANDARD: 'Standard',
  RANKED: 'Ranked',
  CUSTOM: 'Custom',
  EVENT: 'Event',
} as const;

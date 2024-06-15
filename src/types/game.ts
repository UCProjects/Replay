import { Card } from './card';
import { User, Users } from './user';

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

export type GameStateRaw = {
  action: string;
  time: Date;
  turn: number;
  turnPlayer: User['id'];
  players: Tuple<PlayerRaw, 2>;
  board: GameBoard;
  extra: unknown;
};

export type GameState = Modify<GameStateRaw, {
  turnPlayer: User;
  players: Tuple<Player, 2>;
}>;

export type GameRaw = {
  cache: Record<string, unknown>;
  index: GameStateRaw[];
  players: Users;
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

import { Tuple } from './utils';
import { Card } from './card';
import { User } from './user';

export type Player = {
  id: User['id'];
  artifacts: []; // TODO: Artifact structure
  deck: number;
  hand: number;
  health: number;
  maxHealth: number;
  gold: number;
  lives?: number;
  dodge?: number;
};

export type PlayerMeta = {
  ids: Tuple<User['id'], 2>;
  levels: Tuple<User['level'], 2>;
  names: Tuple<User['name'], 2>;
  ranks: Tuple<User['rank'], 2>;
  souls: Tuple<User['class'], 2>;
};

export const GAME_MODE = {
  ANY: 'Any',
  STANDARD: 'Standard',
  RANKED: 'Ranked',
  CUSTOM: 'Custom',
  // EVENT: 'Event',
} as const;

export type GameMode = keyof typeof GAME_MODE;

export type GameType = Omit<GameMode, 'ANY'> | 'EVENT';

export type GameResultTypes = 'game-end-lethal' | 'game-end-surrender' | 'game-end-disconnection' | 'game-end-chara' | 'timeout';

export type GameResult = {
  type: GameResultTypes;
  winner: User['id'];
};

export type GameBoard = Tuple<Card?, 8>;

export type GameState = {
  action: string;
  time: Date;
  turn: number;
  turnPlayer: User['id'];
  players: Tuple<Player, 2>;
  board: GameBoard;
  extra: unknown;
};

export type GameRaw = {
  cache: Record<string, unknown>;
  index: GameState[];
  players: Tuple<User, 2>;
};

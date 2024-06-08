import { Tuple } from './utils';
import { Card } from './card';
import { User } from './user';

export type Player = {
  id: User['id'];
  artifacts: [];
  deck: number;
  hand: number;
  health: number;
  maxHealth: number;
  gold: number;
  lives?: number;
  dodge?: number;
};

export type GameMeta = {
  ids: Tuple<User['id'], 2>;
  levels: Tuple<User['level'], 2>;
  names: Tuple<User['name'], 2>;
  ranks: Tuple<User['rank'], 2>;
  souls: Tuple<User['class'], 2>;
};

export type GameType = 'STANDARD' | 'RANKED' | 'CUSTOM' | 'EVENT';

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

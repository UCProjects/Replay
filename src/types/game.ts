import { Card } from './card';
import { User, Users } from './user';

export type Player = {
  // TODO: Convert to user
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

export const MODE = {
  ANY: 'Any',
  STANDARD: 'Standard',
  RANKED: 'Ranked',
  CUSTOM: 'Custom',
  EVENT: 'Event',
} as const;

export type GameMode = keyof typeof MODE;

export type GameType = Exclude<GameMode, 'ANY'>;

export type GameResultTypes = 'game-end-lethal' | 'game-end-surrender' | 'game-end-disconnection' | 'game-end-chara' | 'timeout';

export type GameResult = {
  type: GameResultTypes;
  winner: User['id'];
};

export type GameBoard = Tuple<Card | null, 8>;

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
  players: Users;
};

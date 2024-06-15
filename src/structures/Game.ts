import {
  Game,
  GameRaw,
  GameState,
  Player,
} from '~/types/game';
import { GameRecord } from './GameRecord';

export type LoadedGame = GameRecord & Game;

export function parseGame(record: GameRecord, data: GameRaw): LoadedGame {
  const index: GameState[] = data.index.map((state) => ({
    ...state,
    turnPlayer: record.getUser(state.turnPlayer),
    // Typescript isn't smart enough to detect "replacement" mapping
    players: state.players.map((player) => ({
      ...player,
      user: record.getUser(player.id),
    })) as Tuple<Player, 2>,
  }));
  return {
    ...record,
    ...data,
    index,
    getUser(userId) {
      return record.getUser(userId);
    },
  };
}

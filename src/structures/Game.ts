import {
  Game,
  GameRaw,
  GameState,
  Player,
} from '~/types/game';
import { GameRecord } from './GameRecord';

export default function parseGame(record: GameRecord, data: GameRaw): Game {
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
  };
}

import { FirestoreDataConverter } from 'firebase/firestore';

import {
  GameResult,
  GameType,
} from '../types/game';
import metaToUsers from '../utils/metaToUsers';
import { UserMeta, Users } from '../types/user';

type GameInfo = {
  cards: DocumentKey;
  date: Date;
  id: number;
  playermeta: UserMeta;
  results: GameResult;
  start: Date;
  translation: DocumentKey;
  type: GameType;
};

export class GameRecord {
  public readonly cards: DocumentKey;

  public readonly date: Date;

  public readonly gameId: number;

  public readonly key: DocumentKey;

  public readonly results: GameResult;

  public readonly start: Date;

  public readonly translation: DocumentKey;

  public readonly type: GameType;

  public readonly users: Users;

  constructor(
    {
      cards,
      date,
      id,
      playermeta,
      results,
      start,
      translation,
      type,
    }: GameInfo,
    key: DocumentKey,
  ) {
    this.cards = cards;
    this.date = date;
    this.gameId = id;
    this.key = key;
    this.results = results;
    this.start = start;
    this.translation = translation;
    this.type = type;
    this.users = metaToUsers(playermeta);
  }
}

export type GameRecords = GameRecord[];

export const converter: FirestoreDataConverter<GameRecord, GameInfo> = {
  toFirestore(_record) {
    return {} as GameInfo;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options) as GameInfo;
    const key = snapshot.id;
    return new GameRecord(data, key);
  },
};

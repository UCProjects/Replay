import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

import {
  GameResult,
  GameType,
} from '~/types/game';
import metaToUsers from '~/utils/metaToUsers';
import { User, UserMeta, Users } from '~/types/user';

type GameInfo = {
  cards: DocumentKey;
  date: Timestamp;
  id: number;
  playermeta: UserMeta;
  results: GameResult;
  start: Timestamp;
  translation: DocumentKey;
  type: GameType;
};

export class GameRecord {
  public readonly cards: DocumentKey;

  public readonly date: Date;

  public readonly gameId: number;

  public readonly key: DocumentKey;

  public readonly results: Modify<GameResult, {
    winner: User | null,
  }>;

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
    this.date = date.toDate();
    this.gameId = id;
    this.key = key;
    this.start = start.toDate();
    this.translation = translation;
    this.type = type;
    this.users = metaToUsers(playermeta);
    if (results === null) {
      this.results = {
        type: 'timeout',
        winner: null,
      };
    } else {
      this.results = {
        ...results,
        winner: results.winner ? this.getUser(results.winner) : null,
      };
    }
  }

  getUser(userId: User['id']): User {
    const user = this.users.find(({ id }) => id === userId);
    if (!user) {
      throw new Error(`[${this.key}] User doesn't exist: ${userId}`);
    }
    return user;
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

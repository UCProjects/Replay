import { FirestoreDataConverter, Timestamp } from 'firebase/firestore';

import {
  GameResult,
  GameType,
} from '~/types/game';
import metaToUsers from '~/utils/metaToUsers';
import { User, UserMeta, Users } from '~/types/user';

export type GameInfo = {
  cards: DocumentKey;
  date: Timestamp;
  expireAt?: Timestamp;
  finished?: true;
  id: number;
  playermeta: UserMeta;
  results: GameResult;
  start: Timestamp;
  translation: DocumentKey;
  type: GameType;
};

export type UnfinishedInfo = {
  errored?: boolean;
  finished: false;
  id: number;
  playermeta: UserMeta;
};

const sources = new WeakMap<GameRecord, GameInfo>();

export class GameRecord {
  public readonly cards: DocumentKey;

  public readonly date: Date;

  public readonly gameId: number;

  public readonly key: DocumentKey;

  public readonly kept: boolean;

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
      expireAt,
      id,
      playermeta,
      results,
      start,
      translation,
      type,
    }: GameInfo,
    key: DocumentKey,
  ) {
    sources.set(this, {
      cards,
      date,
      expireAt,
      id,
      playermeta,
      results,
      start,
      translation,
      type,
    });
    this.cards = cards;
    this.date = date.toDate();
    this.gameId = id;
    this.key = key;
    this.kept = expireAt === undefined;
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
        winner: results.winner === null || results.winner === undefined
          ? null
          : this.getUser(results.winner),
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

export function serializeRecord(record: GameRecord): string | undefined {
  const info = sources.get(record);
  if (!info) return undefined;
  return JSON.stringify({
    ...info,
    date: info.date.toMillis(),
    expireAt: info.expireAt?.toMillis(),
    start: info.start.toMillis(),
  });
}

export function reviveRecord(key: DocumentKey, json: string): GameRecord | undefined {
  try {
    const {
      date, expireAt, start, ...rest
    } = JSON.parse(json) as Modify<GameInfo, {
      date: number;
      expireAt?: number;
      start: number;
    }>;
    if (typeof date !== 'number' || typeof start !== 'number' || !rest.playermeta) return undefined;
    return new GameRecord({
      ...rest,
      date: Timestamp.fromMillis(date),
      expireAt: typeof expireAt === 'number' ? Timestamp.fromMillis(expireAt) : undefined,
      start: Timestamp.fromMillis(start),
    }, key);
  } catch {
    return undefined;
  }
}

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

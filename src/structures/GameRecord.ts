import { FirestoreDataConverter } from 'firebase/firestore';

import { GameResult, GameType, GameMeta } from '../types/game';
import { DocumentKey } from '../types/utils';

export class GameRecord {
  public readonly cards: DocumentKey;

  public readonly date: Date;

  public readonly gameId: number;

  public readonly key: DocumentKey;

  public readonly meta: GameMeta;

  public readonly results: GameResult;

  public readonly start: Date;

  public readonly translation: DocumentKey;

  public readonly type: GameType;

  constructor({
    cards, date, id, key, playermeta, results, start, translation, type,
  }) {
    this.cards = cards;
    this.date = date;
    this.gameId = id;
    this.key = key;
    this.meta = playermeta;
    this.results = results;
    this.start = start;
    this.translation = translation;
    this.type = type;
  }
}

export const converter: FirestoreDataConverter<typeof GameRecord> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    const key = snapshot.id;
    return new GameRecord({ key, ...data });
  },
};

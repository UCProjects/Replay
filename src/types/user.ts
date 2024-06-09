import { Soul } from './soul';

export type User = {
  id: number;
  name: string;
  level: number;
  rank: string;
  // TODO: rename class to soul
  class: Soul;
};

export type UserMeta = {
  ids: Tuple<User['id'], 2>;
  levels: Tuple<User['level'], 2>;
  names: Tuple<User['name'], 2>;
  ranks: Tuple<User['rank'], 2>;
  souls: Tuple<User['class'], 2>;
};

export type Users = Tuple<User, 2>;

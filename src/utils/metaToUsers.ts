import { PlayerMeta } from '../types/game';
import { User } from '../types/user';
import { Tuple } from '../types/utils';

export default function metaToUsers({
  ids,
  levels,
  names,
  ranks,
  souls,
}: PlayerMeta): Tuple<User, 2> {
  return [0, 1].map((i) => ({
    id: ids[i],
    level: levels[i],
    name: names[i],
    rank: ranks[i],
    class: souls[i],
  }));
}

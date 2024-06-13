import { UserMeta, Users } from '~/types/user';

export default function metaToUsers({
  ids,
  levels,
  names,
  ranks,
  souls,
}: UserMeta): Users {
  return [0, 1].map((i) => ({
    id: ids[i],
    level: levels[i],
    name: names[i],
    rank: ranks[i],
    class: souls[i],
  })) as Users;
}

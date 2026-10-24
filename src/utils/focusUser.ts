import { User, Users } from '~/types/user';

export type FocusQuery = {
  id?: string;
  name?: string;
};

export function isFocused(user: User, { id = '', name = '' }: FocusQuery = {}): boolean {
  const number = Number(id);
  if (Number.isInteger(number) && number > 0) return user.id === number;
  return Boolean(name) && user.name.toLowerCase() === name.toLowerCase();
}

export function focusLast(users: Users, focus?: FocusQuery): Users {
  const [first, second] = users;
  if (isFocused(first, focus) && !isFocused(second, focus)) return [second, first];
  return users;
}

import { describe, expect, it } from 'vitest';
import { User, Users } from '~/types/user';
import { focusLast, isFocused } from './focusUser';

const user = (id: number, name: string): User => ({
  class: 'DETERMINATION',
  id,
  level: 1,
  name,
  rank: 'E1',
});

const users: Users = [user(1, 'Frisk'), user(2, 'Chara')];

describe('isFocused', () => {
  it('matches a name without regard to case', () => {
    expect(isFocused(users[0], { name: 'frisk' })).toBe(true);
    expect(isFocused(users[1], { name: 'frisk' })).toBe(false);
  });

  it('prefers the id over the name', () => {
    expect(isFocused(users[1], { id: '2', name: 'frisk' })).toBe(true);
    expect(isFocused(users[0], { id: '2', name: 'frisk' })).toBe(false);
  });

  it('matches nobody without a player in the search', () => {
    expect(isFocused(users[0])).toBe(false);
    expect(isFocused(users[0], { id: '', name: '' })).toBe(false);
    expect(isFocused(user(0, ''), { id: '0', name: '' })).toBe(false);
  });
});

describe('focusLast', () => {
  it('moves the searched player to the end', () => {
    expect(focusLast(users, { name: 'Frisk' }).map(({ name }) => name)).toEqual(['Chara', 'Frisk']);
  });

  it('leaves the order alone when the player is already last or absent', () => {
    expect(focusLast(users, { name: 'Chara' })).toBe(users);
    expect(focusLast(users, { name: 'Asriel' })).toBe(users);
    expect(focusLast(users)).toBe(users);
  });

  it('leaves the order alone when both players match', () => {
    const same: Users = [user(1, 'Frisk'), user(2, 'frisk')];
    expect(focusLast(same, { name: 'Frisk' })).toBe(same);
  });
});

import { describe, expect, it } from 'vitest';
import { storyFightOf } from './storyFight';

describe('storyFightOf', () => {
  it('reads the fight number from a story opponent name', () => {
    expect(storyFightOf('story-fight-7-name')).toBe('7');
    expect(storyFightOf('story-fight-10000-name')).toBe('10000');
  });

  it('has nothing for a player name', () => {
    expect(storyFightOf('Frisk')).toBeUndefined();
    expect(storyFightOf('story-fight-x-name')).toBeUndefined();
    expect(storyFightOf('my story-fight-7-name')).toBeUndefined();
  });
});

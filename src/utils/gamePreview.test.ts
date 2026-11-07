import { describe, expect, it } from 'vitest';
import { matchup, parsePreview } from './gamePreview';

describe('parsePreview', () => {
  it('reads ids, names, type and date', () => {
    expect(parsePreview({
      date: '1700000000000',
      ids: '[1,2]',
      names: '["a","b"]',
      type: 'RANKED',
    })).toEqual({
      date: new Date(1700000000000),
      ids: [1, 2],
      names: ['a', 'b'],
      type: 'RANKED',
    });
  });

  it('returns an empty preview for games saved without metadata', () => {
    expect(parsePreview(undefined)).toEqual({
      date: undefined,
      ids: undefined,
      names: undefined,
      type: undefined,
    });
  });

  it('ignores malformed values', () => {
    const preview = parsePreview({ date: 'soon', names: '["a"]', type: '' });
    expect(preview.date).toBeUndefined();
    expect(preview.names).toBeUndefined();
    expect(preview.type).toBeUndefined();
    expect(parsePreview({ names: 'not json' }).names).toBeUndefined();
  });
});

describe('matchup', () => {
  const preview = { ids: [1, 2] as [number, number], names: ['a', 'b'] as [string, string] };

  it('puts the second player first by default', () => {
    expect(matchup(preview)).toEqual(['b', 'a']);
  });

  it('puts the watched player first', () => {
    expect(matchup(preview, 1)).toEqual(['a', 'b']);
    expect(matchup(preview, 2)).toEqual(['b', 'a']);
  });

  it('ignores a watched player who is not in the game', () => {
    expect(matchup(preview, 3)).toEqual(['b', 'a']);
  });

  it('has nothing without names', () => {
    expect(matchup({})).toBeUndefined();
  });
});

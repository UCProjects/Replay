import { describe, expect, it } from 'vitest';
import { liveUrl } from './liveUrl';

describe('liveUrl', () => {
  it('watches the second player by default', () => {
    expect(liveUrl(3385, [763728, 776839])).toBe('https://undercards.net/Spectate?gameId=3385&playerId=776839');
  });

  it('watches the requested player when they are in the game', () => {
    expect(liveUrl(3385, [763728, 776839], 763728)).toBe('https://undercards.net/Spectate?gameId=3385&playerId=763728');
  });

  it('ignores a requested player who is not in the game', () => {
    expect(liveUrl(3385, [763728, 776839], 1)).toBe('https://undercards.net/Spectate?gameId=3385&playerId=776839');
  });

  it('leaves out the player when the ids are unknown', () => {
    expect(liveUrl(3385, undefined)).toBe('https://undercards.net/Spectate?gameId=3385');
  });

  it('has no url without a game number', () => {
    expect(liveUrl(undefined, [763728, 776839])).toBeUndefined();
    expect(liveUrl(0, [763728, 776839])).toBeUndefined();
  });
});

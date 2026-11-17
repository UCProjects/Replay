import { GamePreview } from '~/utils/gamePreview';

export type UnavailableReason = 'errored' | 'live' | 'missing';

export class GameUnavailableError extends Error {
  public readonly gameId: number | undefined;

  public readonly preview: GamePreview | undefined;

  public readonly reason: UnavailableReason;

  constructor(key: string, reason: UnavailableReason, preview?: GamePreview, gameId?: number) {
    super(`[${key}] Game is unavailable: ${reason}`);
    this.gameId = gameId;
    this.preview = preview;
    this.reason = reason;
  }
}

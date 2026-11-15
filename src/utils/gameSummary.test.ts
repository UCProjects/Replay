import { describe, expect, it } from 'vitest';
import { SummaryScene, summarize } from './gameSummary';

const ME = 1;
const THEM = 2;

function scene(action: string, overrides: Partial<SummaryScene> = {}): SummaryScene {
  return {
    action,
    board: Array.from({ length: 8 }, () => null),
    extra: null,
    players: [{ id: THEM, health: 30 }, { id: ME, health: 30 }],
    time: new Date(0),
    turn: 1,
    turnPlayer: { id: ME },
    ...overrides,
  };
}

function health(them: number | undefined, me: number | undefined): SummaryScene['players'] {
  return [{ id: THEM, health: them }, { id: ME, health: me }];
}

function boardWith(slot: number, id: number): SummaryScene['board'] {
  return Array.from({ length: 8 }, (_, i) => (i === slot ? { id } : null));
}

describe('summarize', () => {
  it('counts damage and healing from the change in health, whatever the event is called', () => {
    const { players } = summarize([
      scene('init'),
      scene('healed', { extra: { playerId: THEM, amount: 5 }, players: health(25, 30) }),
      scene('damaged', { extra: { playerId: THEM, amount: 2 }, players: health(27, 30) }),
      scene('damaged', { extra: { playerId: ME, amount: 4 }, players: health(27, 26) }),
    ], [THEM, ME]);
    expect(players.get(THEM)).toMatchObject({ damageTaken: 5, healing: 2 });
    expect(players.get(ME)).toMatchObject({ damageTaken: 4, healing: 0 });
  });

  it('reads missing health as zero, which is how a defeated player is recorded', () => {
    const { players } = summarize([
      scene('init', { players: health(3, 30) }),
      scene('healed', { extra: { playerId: THEM, amount: 3 }, players: health(undefined, 30) }),
    ], [THEM, ME]);
    expect(players.get(THEM)?.damageTaken).toBe(3);
  });

  it('credits played cards to the player whose turn it is', () => {
    const { players } = summarize([
      scene('monster'),
      scene('spell'),
      scene('monster', { turnPlayer: { id: THEM } }),
    ], [THEM, ME]);
    expect(players.get(ME)).toMatchObject({ monsters: 1, spells: 1 });
    expect(players.get(THEM)).toMatchObject({ monsters: 1, spells: 0 });
  });

  it('charges a killed monster to the side of the board it was last seen on', () => {
    const { players } = summarize([
      scene('monster', { board: boardWith(2, 40) }),
      scene('monster', { board: boardWith(6, 41) }),
      scene('update'),
      scene('killed', { extra: { id: 40 } }),
      scene('killed', { extra: { id: 41 } }),
      scene('killed', { extra: { id: 99 } }),
    ], [THEM, ME]);
    expect(players.get(THEM)?.monstersLost).toBe(1);
    expect(players.get(ME)?.monstersLost).toBe(1);
  });

  it('takes the turn count and the length of the game from the scenes', () => {
    const summary = summarize([
      scene('init', { time: new Date(1000) }),
      scene('gameTurn', { turn: 7, time: new Date(61000) }),
      scene('finish', { turn: 7, time: new Date(91000) }),
    ], [THEM, ME]);
    expect(summary.turns).toBe(7);
    expect(summary.duration).toBe(90000);
  });

  it('copes with an empty game', () => {
    expect(summarize([], [THEM, ME])).toMatchObject({ duration: 0, turns: 0 });
  });
});

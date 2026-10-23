import { describe, expect, it } from 'vitest';
import { GameStateExpanded } from '~/types/game';
import { highlightsOf } from './highlights';

const state = (action: string, extra?: unknown) => (
  { action, extra } as unknown as GameStateExpanded
);

const empty = {
  affectedSlots: [],
  attacking: [],
  defending: [],
  effectArtifacts: [],
  effectCards: [],
  effectNames: [],
  effectSlots: [],
  targeted: [],
};

describe('highlightsOf', () => {
  it('marks the slot an enchant fired from, the cards and the slots it touched', () => {
    expect(highlightsOf(state('enchantEffect', {
      trigger: 2,
      affected: { cards: [{ id: 7 }], slots: [1, 3] },
    }))).toEqual({
      ...empty,
      affectedSlots: [1, 3],
      defending: [7],
      effectSlots: [2],
    });
  });

  it('keeps a trigger on slot zero', () => {
    expect(highlightsOf(state('enchantEffect', { trigger: 0 })).effectSlots).toEqual([0]);
  });

  it('marks nothing for events that do not point at anything', () => {
    expect(highlightsOf(state('update'))).toEqual(empty);
    expect(highlightsOf(state('monster', { id: 4 }))).toEqual(empty);
    expect(highlightsOf(state('attack'))).toEqual(empty);
  });

  it('marks the attacker and the defending card', () => {
    expect(highlightsOf(state('attack', { attacker: { id: 1 }, defender: { id: 2 }, damage: 3 }))).toEqual({
      ...empty,
      attacking: [1],
      defending: [2],
    });
  });

  it('marks the attacker and the player that was attacked', () => {
    expect(highlightsOf(state('attackPlayer', { attacker: { id: 1 }, defender: { id: 900 } }))).toEqual({
      ...empty,
      attacking: [1],
      targeted: [900],
    });
  });

  it('marks the player whose health changed', () => {
    expect(highlightsOf(state('damaged', { playerId: 900, amount: 2 }))).toEqual({ ...empty, targeted: [900] });
    expect(highlightsOf(state('healed', { playerId: 901, amount: 2 }))).toEqual({ ...empty, targeted: [901] });
  });

  it('marks a card effect, and what it touched', () => {
    expect(highlightsOf(state('cardEffect', {
      trigger: { id: 5 },
      affected: { cards: [{ id: 6 }, { id: 7 }], players: [900] },
    }))).toEqual({
      ...empty,
      effectCards: [5],
      defending: [6, 7],
      targeted: [900],
    });
  });

  it('marks a soul by the name and an artifact by its row', () => {
    expect(highlightsOf(state('soulEffect', { trigger: { id: 900 }, affected: { players: [{ id: 901 }] } }))).toEqual({
      ...empty,
      effectNames: [900],
      targeted: [901],
    });
    expect(highlightsOf(state('artifactEffect', { trigger: { id: 901 } }))).toEqual({
      ...empty,
      effectArtifacts: [901],
    });
  });

  it('copes with an effect that touched nothing, which the recorder stores as empty', () => {
    expect(highlightsOf(state('cardEffect', { trigger: { id: 5 }, affected: {} }))).toEqual({
      ...empty,
      effectCards: [5],
    });
  });

  it('ignores references that have no id', () => {
    expect(highlightsOf(state('cardEffect', {
      trigger: { id: 5 },
      affected: { cards: [{}, null, { id: 9 }], players: [null] },
    }))).toEqual({
      ...empty,
      effectCards: [5],
      defending: [9],
    });
  });
});

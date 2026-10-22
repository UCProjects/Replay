import { describe, expect, it } from 'vitest';
import { describeAnimation } from './animationEffects';

describe('describeAnimation', () => {
  it('shows a loss of health in yellow with its sign', () => {
    expect(describeAnimation({
      animation: 'HP_STAT', idTarget: 5, target: 'MONSTER', value: -2,
    })).toEqual({
      color: '#ffd400', id: 5, kind: 'stat', stat: 'hp', target: 'MONSTER', text: '-2',
    });
  });

  it('shows a gain of health in green with a plus', () => {
    expect(describeAnimation({
      animation: 'HP_STAT', idTarget: 5, target: 'PLAYER', value: 1,
    })).toMatchObject({ color: 'rgb(13, 208, 0)', target: 'PLAYER', text: '+1' });
  });

  it('colors attack and cost changes the way the game does', () => {
    expect(describeAnimation({
      animation: 'ATTACK_STAT', idTarget: 1, target: 'MONSTER', value: 1,
    })).toMatchObject({ color: '#f00000', stat: 'attack' });
    expect(describeAnimation({
      animation: 'ATTACK_STAT', idTarget: 1, target: 'MONSTER', value: -1,
    })).toMatchObject({ color: '#c600d3' });
    expect(describeAnimation({
      animation: 'COST_STAT', idTarget: 1, target: 'MONSTER', value: -1,
    })).toMatchObject({ color: '#00fff7', stat: 'cost' });
  });

  it('describes a heal on a monster or a player', () => {
    expect(describeAnimation({ animation: 'HEAL', idTarget: 9, target: 'PLAYER' }))
      .toEqual({ id: 9, kind: 'heal', target: 'PLAYER' });
  });

  it('flashes a card for a buff or a debuff', () => {
    expect(describeAnimation({ animation: 'ATTACK_BUFF', idTarget: 4, target: 'MONSTER' }))
      .toEqual({
        duration: 870, id: 4, image: 'AttackBuff', kind: 'flash',
      });
    expect(describeAnimation({ animation: 'HP_DEBUFF', idTarget: 4, target: 'MONSTER' }))
      .toEqual({
        duration: 810, id: 4, image: 'HpDebuff', kind: 'flash',
      });
  });

  it('flashes a card for freeze, poison and silence with the game timings', () => {
    expect(describeAnimation({ animation: 'FREEZE', idTarget: 2, target: 'MONSTER' }))
      .toMatchObject({ duration: 1200, image: 'Ice', kind: 'flash' });
    expect(describeAnimation({ animation: 'POISON', idTarget: 2, target: 'MONSTER' }))
      .toMatchObject({ duration: 800, image: 'Poison' });
    expect(describeAnimation({ animation: 'SILENCE', idTarget: 2, target: 'MONSTER' }))
      .toMatchObject({ duration: 1680, image: 'Silence' });
  });

  it('describes the animations that cover the board without a target', () => {
    expect(describeAnimation({ animation: 'SPELL', waitTime: 0 }))
      .toEqual({ duration: 1150, kind: 'spell' });
    expect(describeAnimation({ animation: 'BARRIER_BREAK' }))
      .toEqual({ duration: 3550, kind: 'barrier' });
  });

  it('has no flash for a player', () => {
    expect(describeAnimation({ animation: 'HP_BUFF', idTarget: 1, target: 'PLAYER' })).toBeNull();
  });

  it('has nothing for animations it does not draw yet', () => {
    expect(describeAnimation({ animation: 'DRAW', waitTime: 0.5 })).toBeNull();
    expect(describeAnimation({ animation: 'BLACK_OUT' })).toBeNull();
    expect(describeAnimation(null)).toBeNull();
  });

  it('ignores an attack or cost change aimed at a player', () => {
    expect(describeAnimation({
      animation: 'ATTACK_STAT', idTarget: 1, target: 'PLAYER', value: 1,
    })).toBeNull();
  });
});

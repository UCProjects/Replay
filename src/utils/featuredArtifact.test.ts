import { describe, expect, it } from 'vitest';
import { Artifact } from '~/types/game';
import { featuredAcross } from './featuredArtifact';

const art = (id: number, extra: Partial<Artifact> = {}): Artifact => ({
  id,
  image: `Art${id}`,
  ...extra,
});

describe('featuredAcross', () => {
  it('has no featured artifact while nothing changes', () => {
    const lists = [[art(1), art(2)], [art(1), art(2)]];
    expect(featuredAcross(lists)).toEqual([undefined, undefined]);
  });

  it('features the artifact whose counter changed', () => {
    const lists = [
      [art(1, { custom: '0' }), art(2)],
      [art(1, { custom: '0' }), art(2)],
      [art(1, { custom: '1' }), art(2)],
      [art(1, { custom: '1' }), art(2)],
    ];
    expect(featuredAcross(lists)).toEqual([undefined, undefined, 1, 1]);
  });

  it('moves to whichever artifact changed last', () => {
    const lists = [
      [art(1, { custom: '0' }), art(2, { custom: '0' })],
      [art(1, { custom: '1' }), art(2, { custom: '0' })],
      [art(1, { custom: '1' }), art(2, { custom: '4' })],
    ];
    expect(featuredAcross(lists)).toEqual([undefined, 1, 2]);
  });

  it('features an artifact that appears and a toggle of disabled', () => {
    const lists = [[art(1)], [art(1), art(2)], [art(1, { disabled: true }), art(2)]];
    expect(featuredAcross(lists)).toEqual([undefined, 2, 1]);
  });

  it('goes back to the first artifact when the featured one is removed', () => {
    const lists = [
      [art(1), art(2, { custom: '0' })],
      [art(1), art(2, { custom: '1' })],
      [art(1)],
    ];
    expect(featuredAcross(lists)).toEqual([undefined, 2, undefined]);
  });

  it('copes with scenes that have no artifacts', () => {
    expect(featuredAcross([undefined, [art(1)], undefined])).toEqual([undefined, 1, undefined]);
  });
});

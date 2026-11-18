import { describe, expect, it } from 'vitest';
import { Artifact } from '~/types/game';
import { artifactCounter } from './artifactCounter';

const art = (extra: Partial<Artifact> = {}): Artifact => ({ id: 1, image: 'Art', ...extra });

describe('artifactCounter', () => {
  it('shows the custom counter when there is one', () => {
    expect(artifactCounter(art({ custom: '20' }))).toBe('20');
  });

  it('shows progress toward a goal', () => {
    expect(artifactCounter(art({ goal: 30, progress: 10 }))).toBe('10/30');
  });

  it('counts a missing progress as zero, since the recorder drops zeros', () => {
    expect(artifactCounter(art({ goal: 30 }))).toBe('0/30');
  });

  it('shows nothing for an artifact with no counter', () => {
    expect(artifactCounter(art())).toBeUndefined();
    expect(artifactCounter(art({ progress: 4 }))).toBeUndefined();
  });
});

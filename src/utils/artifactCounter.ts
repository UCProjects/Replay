import { Artifact } from '~/types/game';

export function artifactCounter({ custom, goal, progress }: Artifact): string | undefined {
  if (custom !== undefined) return custom;
  return goal === undefined ? undefined : `${progress ?? 0}/${goal}`;
}

import { Artifact } from '~/types/game';
import { artifactCounter } from './artifactCounter';

const signature = (art: Artifact) => `${artifactCounter(art) ?? ''}|${art.disabled ? 1 : 0}`;

export function featuredAcross(lists: (Artifact[] | undefined)[]): (number | undefined)[] {
  const result: (number | undefined)[] = [];
  let previous = new Map<number, string>();
  let featured: number | undefined;

  lists.forEach((list, index) => {
    const artifacts = list ?? [];
    const current = new Map(artifacts.map((art) => [art.id, signature(art)]));
    if (index > 0) {
      artifacts.forEach((art) => {
        if (previous.get(art.id) !== current.get(art.id)) featured = art.id;
      });
    }
    if (featured !== undefined && !current.has(featured)) featured = undefined;
    previous = current;
    result.push(featured);
  });

  return result;
}

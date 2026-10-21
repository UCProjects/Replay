import { useCallback } from 'react';
import { useTranslation } from '~/hooks/useTranslation';
import { storyFightOf } from '~/utils/storyFight';

export function useDisplayName(): (name: string) => string {
  const t = useTranslation();
  return useCallback(
    (name: string) => (storyFightOf(name) === undefined ? name : t(name, { fallback: name })),
    [t],
  );
}

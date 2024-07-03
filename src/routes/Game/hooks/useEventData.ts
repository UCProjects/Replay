import { useMemo } from 'react';
import { useGameState } from '~/hooks/useGame';
import { Actions } from '~/types/game';

export function useEventData<A extends keyof Actions>(action: A): Actions[A] | null {
  const state = useGameState();
  return useMemo(() => {
    if (state.action !== action || state.extra === undefined) return null;
    return state.extra as Actions[A];
  }, [action, state]);
}

import { useMemo } from 'react';
import { useEventState } from '~/hooks/useGame';
import { Actions } from '~/types/game';
import { getEventData } from '~/utils/getEventData';

export function useEventData<A extends keyof Actions>(action: A): Actions[A] | null {
  const state = useEventState();
  return useMemo(
    () => getEventData(action, state),
    [action, state],
  );
}

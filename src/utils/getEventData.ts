import { Actions, GameStateExpanded } from '~/types/game';

export function getEventData<A extends keyof Actions>(
  action: A,
  state: GameStateExpanded,
): Actions[A] | null {
  if (state.action !== action || state.extra === undefined) return null;
  return state.extra as Actions[A];
}

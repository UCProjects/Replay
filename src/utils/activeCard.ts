import { Card } from '~/types/card';
import { GameStateExpanded, Slot } from '~/types/game';

export function activeCardOf(state: GameStateExpanded): Slot {
  switch (state.action) {
    case 'discard':
    case 'exposed':
    case 'spell':
      return state.extra as Card;
    default: return null;
  }
}

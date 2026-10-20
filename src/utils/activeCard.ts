import { Card } from '~/types/card';
import { GameStateExpanded, Slot } from '~/types/game';

type Trigger = { trigger?: Card };

export function activeCardOf(state: GameStateExpanded): Slot {
  switch (state.action) {
    case 'discard':
    case 'exposed':
    case 'spell':
      return state.extra as Card;
    case 'cardEffect': {
      const { trigger } = (state.extra ?? {}) as Trigger;
      const onBoard = state.board.some((card) => card && card.id === trigger?.id);
      return trigger && !onBoard ? trigger : null;
    }
    default: return null;
  }
}

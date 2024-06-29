import { useEffect } from 'react';
import {
  useGameState,
  useSetActiveSlot,
} from '~/hooks/useGame';
import { Card } from '~/types/card';
import {
  GameStateExpanded,
  Slot,
} from '~/types/game';

function getActiveCard(state: GameStateExpanded): Slot {
  switch (state.action) {
    case 'discard':
    case 'exposed':
    case 'spell':
      return state.extra as Card;
    default: return null;
  }
}

export default function useEvents() {
  const state = useGameState();
  const setActiveSlot = useSetActiveSlot();

  useEffect(() => {
    setActiveSlot(getActiveCard(state));
  }, [setActiveSlot, state]);
}

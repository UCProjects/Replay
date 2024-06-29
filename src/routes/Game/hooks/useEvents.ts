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

const IGNORED_EVENTS: Array<GameStateExpanded['action']> = [
  'log',
  'update',
];

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
    if (IGNORED_EVENTS.includes(state.action)) return;

    setActiveSlot(getActiveCard(state));
  }, [setActiveSlot, state]);
}

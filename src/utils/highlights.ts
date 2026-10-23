import { GameStateExpanded } from '~/types/game';

export type Highlights = {
  affectedSlots: number[];
  attacking: number[];
  defending: number[];
  effectArtifacts: number[];
  effectCards: number[];
  effectNames: number[];
  effectSlots: number[];
  targeted: number[];
};

type Reference = { id?: number } | number | null | undefined;

type EffectExtra = {
  trigger?: Reference;
  affected?: {
    cards?: Reference[] | null;
    players?: Reference[] | null;
    slots?: number[] | null;
  };
};

type AttackExtra = {
  attacker?: Reference;
  defender?: Reference;
};

function ids(values: Reference[] | null | undefined): number[] {
  return (values ?? []).flatMap((value) => {
    const id = value && typeof value === 'object' ? value.id : value;
    return typeof id === 'number' ? [id] : [];
  });
}

export function highlightsOf(state: GameStateExpanded): Highlights {
  const highlights: Highlights = {
    affectedSlots: [],
    attacking: [],
    defending: [],
    effectArtifacts: [],
    effectCards: [],
    effectNames: [],
    effectSlots: [],
    targeted: [],
  };

  switch (state.action) {
    case 'attack': {
      const { attacker, defender } = (state.extra ?? {}) as AttackExtra;
      highlights.attacking = ids([attacker]);
      highlights.defending = ids([defender]);
      break;
    }
    case 'attackPlayer': {
      const { attacker, defender } = (state.extra ?? {}) as AttackExtra;
      highlights.attacking = ids([attacker]);
      highlights.targeted = ids([defender]);
      break;
    }
    case 'damaged':
    case 'healed': {
      const { playerId } = (state.extra ?? {}) as { playerId?: number };
      highlights.targeted = ids([playerId]);
      break;
    }
    case 'enchantEffect': {
      const { trigger, affected } = (state.extra ?? {}) as EffectExtra;
      highlights.effectSlots = ids([trigger]);
      highlights.defending = ids(affected?.cards);
      highlights.affectedSlots = ids(affected?.slots);
      break;
    }
    case 'cardEffect':
    case 'soulEffect':
    case 'artifactEffect': {
      const { trigger, affected } = (state.extra ?? {}) as EffectExtra;
      if (state.action === 'cardEffect') highlights.effectCards = ids([trigger]);
      if (state.action === 'soulEffect') highlights.effectNames = ids([trigger]);
      if (state.action === 'artifactEffect') highlights.effectArtifacts = ids([trigger]);
      highlights.defending = ids(affected?.cards);
      highlights.targeted = ids(affected?.players);
      break;
    }
    default:
  }

  return highlights;
}

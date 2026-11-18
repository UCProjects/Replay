export type SummaryScene = {
  action: string;
  board: ({ id: number } | null)[];
  extra: unknown;
  players: { health?: number; id: number }[];
  time: Date;
  turn: number;
  turnPlayer: { id: number };
};

export type PlayerSummary = {
  damageTaken: number;
  healing: number;
  monsters: number;
  monstersLost: number;
  spells: number;
};

export type GameSummary = {
  duration: number;
  players: Map<number, PlayerSummary>;
  turns: number;
};

const SIDE = 4;

function healthOf(scene: SummaryScene, playerId: number): number {
  return scene.players.find((player) => player.id === playerId)?.health ?? 0;
}

function ownerOf(
  scenes: SummaryScene[],
  from: number,
  cardId: number,
  sides: [number, number],
): number | undefined {
  const holding = (scene: SummaryScene) => scene.board.findIndex((card) => card?.id === cardId);
  const scene = scenes.slice(0, from + 1).reverse().find((candidate) => holding(candidate) >= 0);
  if (!scene) return undefined;
  return holding(scene) < SIDE ? sides[0] : sides[1];
}

export function summarize(scenes: SummaryScene[], sides: [number, number]): GameSummary {
  const players = new Map(sides.map((id) => [id, {
    damageTaken: 0,
    healing: 0,
    monsters: 0,
    monstersLost: 0,
    spells: 0,
  }]));

  scenes.forEach((scene, index) => {
    switch (scene.action) {
      case 'damaged':
      case 'healed': {
        const { playerId } = (scene.extra ?? {}) as { playerId?: number };
        const stats = playerId === undefined ? undefined : players.get(playerId);
        if (!stats || playerId === undefined || index === 0) break;
        const change = healthOf(scene, playerId) - healthOf(scenes[index - 1], playerId);
        if (change < 0) stats.damageTaken -= change;
        else stats.healing += change;
        break;
      }
      case 'monster':
      case 'spell': {
        const stats = players.get(scene.turnPlayer.id);
        if (!stats) break;
        if (scene.action === 'monster') stats.monsters += 1;
        else stats.spells += 1;
        break;
      }
      case 'killed': {
        const { id } = (scene.extra ?? {}) as { id?: number };
        const owner = id === undefined ? undefined : ownerOf(scenes, index, id, sides);
        const stats = owner === undefined ? undefined : players.get(owner);
        if (stats) stats.monstersLost += 1;
        break;
      }
      default:
    }
  });

  const first = scenes[0];
  const last = scenes[scenes.length - 1];
  return {
    duration: first && last ? Math.max(last.time.getTime() - first.time.getTime(), 0) : 0,
    players,
    turns: scenes.reduce((most, scene) => Math.max(most, scene.turn ?? 0), 0),
  };
}

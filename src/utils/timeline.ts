export type TimelineScene = {
  action: string;
  time: Date;
};

export type Timeline = {
  durations: number[];
  starts: number[];
  total: number;
  event: number[];
  steps: number[];
};

const FIXED_DURATION: Record<string, number> = {
  attack: 1000,
  attackPlayer: 1000,
  cardEffect: 1000,
  discard: 1000,
  enchantEffect: 1000,
  exposed: 1000,
  playerTurn: 1000,
  soulEffect: 1000,
  spell: 1000,
};

const MAX_DURATION = 3000;
const MAX_UPDATE_DURATION = 200;

const CARRIES_EVENT = ['animation', 'emote', 'log', 'unknown', 'update'];
const NOT_A_STEP = ['animation', 'emote', 'gameTurn', 'init', 'log', 'unknown', 'update'];

function durationOf(scene: TimelineScene, next: TimelineScene | undefined): number {
  if (!next) return 0;
  const gap = FIXED_DURATION[scene.action] ?? (next.time.getTime() - scene.time.getTime());
  if (!Number.isFinite(gap)) return 0;
  const max = scene.action === 'update' ? MAX_UPDATE_DURATION : MAX_DURATION;
  return Math.min(Math.max(gap, 0), max);
}

export function buildTimeline(scenes: TimelineScene[]): Timeline {
  const durations = scenes.map((scene, i) => durationOf(scene, scenes[i + 1]));

  const starts: number[] = [];
  let elapsed = 0;
  durations.forEach((duration) => {
    starts.push(elapsed);
    elapsed += duration;
  });

  const event = Array.from({ length: scenes.length }, (_, i) => i);
  scenes.forEach((scene, i) => {
    if (i > 0 && CARRIES_EVENT.includes(scene.action)) event[i] = event[i - 1];
  });

  const steps = scenes.flatMap((scene, i) => (NOT_A_STEP.includes(scene.action) ? [] : [i]));

  return {
    durations,
    starts,
    total: elapsed,
    event,
    steps,
  };
}

export function findScene({ starts }: Timeline, time: number): number {
  if (!starts.length) return 0;
  let low = 0;
  let high = starts.length - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (starts[middle] <= time) {
      low = middle;
    } else {
      high = middle - 1;
    }
  }
  return low;
}

export function stepScene(
  timeline: Timeline,
  position: number,
  direction: 1 | -1,
  minGap = 0,
): number {
  const last = timeline.starts.length - 1;
  if (direction > 0) {
    return timeline.steps.find((index) => index > position) ?? Math.max(last, 0);
  }
  const latest = (timeline.starts[position] ?? 0) - minGap;
  const before = timeline.steps.filter(
    (index) => index < position && timeline.starts[index] <= latest,
  );
  return before.length ? before[before.length - 1] : 0;
}

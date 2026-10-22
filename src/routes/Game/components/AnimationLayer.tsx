import { Box, Portal } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { GameContext } from '~/hooks/useGame';
import { useContent } from '~/hooks/useContent';
import {
  AnimationEffect,
  describeAnimation,
  EFFECT_DURATION,
} from '~/utils/animationEffects';

type Placed = {
  effect: AnimationEffect;
  rect: DOMRect;
  scene: number;
};

const rise = keyframes`
  0% { font-size: 18px; opacity: 1; transform: translateY(0); }
  75% { font-size: 44px; opacity: 1; transform: translateY(-40px); }
  100% { font-size: 44px; opacity: 0; transform: translateY(-40px); }
`;

const STAT_PART = {
  attack: '.card-attack',
  cost: '.card-cost',
  hp: '.card-health',
} as const;

function rectOf(selector: string): DOMRect | null {
  const rect = document.querySelector(selector)?.getBoundingClientRect();
  return rect && rect.width > 0 ? rect : null;
}

function locate(effect: AnimationEffect): DOMRect | null {
  if (effect.kind === 'barrier') return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  if (effect.kind === 'spell') return rectOf('[data-board]');
  const card = `[data-card-id="${effect.id}"]`;
  const bar = `[data-user-id="${effect.id}"] .hpBar`;
  if (effect.kind === 'flash') return rectOf(card);
  if (effect.target === 'PLAYER') return rectOf(bar);
  if (effect.kind === 'heal') return rectOf(card);
  return rectOf(`${card} ${STAT_PART[effect.stat]}`) ?? rectOf(card);
}

function durationOf(effect: AnimationEffect): number {
  if (effect.kind === 'flash' || effect.kind === 'spell' || effect.kind === 'barrier') {
    return effect.duration;
  }
  return effect.kind === 'heal' ? EFFECT_DURATION.heal[effect.target] : EFFECT_DURATION.stat;
}

function Drawn({ effect, rect }: Omit<Placed, 'scene'>): ReactNode {
  if (effect.kind === 'barrier') {
    return (
      <Box
        alt=""
        component="img"
        src="/images/vfx/BarrierBreak.png"
        sx={{
          height: '100vh',
          left: 0,
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          width: '100vw',
        }}
      />
    );
  }
  if (effect.kind === 'spell') {
    return (
      <Box
        alt=""
        component="img"
        src="/images/vfx/Spell.png"
        sx={{
          height: rect.height * 0.7,
          left: rect.left + rect.width / 2,
          pointerEvents: 'none',
          position: 'fixed',
          top: rect.top + rect.height / 2,
          transform: 'translate(-50%, -50%)',
        }}
      />
    );
  }
  if (effect.kind === 'flash') {
    return (
      <Box
        alt=""
        component="img"
        src={`/images/vfx/${effect.image}.png`}
        sx={{
          height: rect.height,
          left: rect.left,
          pointerEvents: 'none',
          position: 'fixed',
          top: rect.top,
        }}
      />
    );
  }
  if (effect.kind === 'heal') {
    const player = effect.target === 'PLAYER';
    return (
      <Box
        alt=""
        component="img"
        src={`/images/vfx/${player ? 'Heal_Player' : 'Heal'}.png`}
        sx={{
          height: player ? undefined : rect.height,
          left: player ? rect.left - 22 : rect.left,
          pointerEvents: 'none',
          position: 'fixed',
          top: player ? rect.top - 65 : rect.top,
        }}
      />
    );
  }
  return (
    <Box
      sx={{
        fontFamily: 'DTM-Mono',
        left: rect.left + rect.width / 2,
        pointerEvents: 'none',
        position: 'fixed',
        textAlign: 'center',
        top: rect.top,
        transform: 'translateX(-50%)',
        width: 160,
      }}
    >
      <Box
        component="span"
        sx={{
          animation: `${rise} ${EFFECT_DURATION.stat}ms linear forwards`,
          color: effect.color,
          display: 'block',
          textShadow: '-1px -1px #000, 1px 1px #000, -1px 1px #000, 1px -1px #000',
        }}
      >
        {effect.text}
      </Box>
    </Box>
  );
}

export function AnimationLayer(): ReactNode {
  const {
    game,
    pin,
    playing,
    position,
  } = useContent(GameContext);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const last = useRef(-1);

  useEffect(() => {
    if (last.current === position) return;
    last.current = position;
    if (!playing || pin !== null) return;
    const scene = game.index[position];
    if (scene?.action !== 'animation') return;
    const effect = describeAnimation(scene.extra);
    const rect = effect && locate(effect);
    if (!effect || !rect) return;
    setPlaced((old) => [...old, { effect, rect, scene: position }]);
    window.setTimeout(
      () => setPlaced((old) => old.filter(({ scene: shown }) => shown !== position)),
      durationOf(effect),
    );
  }, [game, pin, playing, position]);

  return (
    <Portal>
      <Box sx={(theme) => ({ zIndex: theme.zIndex.tooltip, position: 'fixed' })}>
        {placed.map(({ effect, rect, scene }) => (
          <Drawn effect={effect} key={scene} rect={rect} />
        ))}
      </Box>
    </Portal>
  );
}

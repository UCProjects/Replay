import {
  Menu,
  Pause,
  PlayArrow,
  Replay,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Slider,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useGame, usePlayback } from '~/hooks/useGame';
import { useTranslation } from '~/hooks/useTranslation';
import GameMenu from './GameMenu';

function format(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${`${seconds % 60}`.padStart(2, '0')}`;
}

function PlayIcon({ finished, playing }: { finished: boolean; playing: boolean }): ReactNode {
  if (playing) return <Pause />;
  return finished ? <Replay /> : <PlayArrow />;
}

function label(finished: boolean, playing: boolean): string {
  if (playing) return 'Pause';
  return finished ? 'Replay' : 'Play';
}

export default function Controls(): ReactNode {
  const {
    commitScrub,
    elapsed,
    finished,
    pause,
    play,
    playing,
    scrub,
    step,
    total,
  } = usePlayback();
  const t = useTranslation();
  const { type } = useGame();
  const [dragging, setDragging] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = useCallback((_: Event, value: number | number[]) => {
    const time = Array.isArray(value) ? value[0] : value;
    setDragging(time);
    scrub(time);
  }, [scrub]);

  const handleCommit = useCallback(() => {
    setDragging(null);
    commitScrub();
  }, [commitScrub]);

  const handleOpenMenu = useCallback(() => setMenuOpen(true), []);
  const handleCloseMenu = useCallback(() => setMenuOpen(false), []);
  const handlePrevious = useCallback(() => step(-1), [step]);
  const handleNext = useCallback(() => step(1), [step]);

  return (
    <Box
      className="controls"
      sx={{
        alignItems: 'center',
        color: 'white',
        display: 'flex',
        gap: 1,
        padding: { sm: '4px 12px', xs: '4px 4px' },
        userSelect: 'none',
      }}
    >
      <IconButton
        aria-label="Menu"
        color="inherit"
        onClick={handleOpenMenu}
        size="small"
      >
        <Menu />
      </IconButton>
      <GameMenu
        onClose={handleCloseMenu}
        open={menuOpen}
      />
      <Box component="span">
        {`[${t(`game-type-${type.toLowerCase()}`, { fallback: type })}]`}
      </Box>
      <IconButton
        aria-label="Previous event"
        color="inherit"
        onClick={handlePrevious}
        size="small"
      >
        <SkipPrevious />
      </IconButton>
      <IconButton
        aria-label={label(finished, playing)}
        color="inherit"
        onClick={playing ? pause : play}
      >
        <PlayIcon
          finished={finished}
          playing={playing}
        />
      </IconButton>
      <IconButton
        aria-label="Next event"
        color="inherit"
        onClick={handleNext}
        size="small"
      >
        <SkipNext />
      </IconButton>
      <Box component="span">{format(dragging ?? elapsed)}</Box>
      <Slider
        aria-label="Replay position"
        max={Math.max(total, 1)}
        min={0}
        onChange={handleChange}
        onChangeCommitted={handleCommit}
        size="small"
        step={50}
        sx={{ color: 'white' }}
        value={dragging ?? elapsed}
      />
      <Box component="span">{format(total)}</Box>
    </Box>
  );
}

import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { useRevalidator, useSearchParams } from 'react-router-dom';
import { useDisplayName } from '~/hooks/useDisplayName';
import { usePageTitle } from '~/hooks/usePageTitle';
import { UnavailableReason } from '~/structures/GameUnavailableError';
import { RETENTION_DAYS } from '~/utils/favoriteRisk';
import { GamePreview, matchup } from '~/utils/gamePreview';

export type GameUnavailableProps = {
  id: string;
  preview?: GamePreview;
  reason: UnavailableReason;
};

const MESSAGES: Record<UnavailableReason, string> = {
  errored: 'Something went wrong while recording this game, so it has no replay.',
  live: 'This game is still being played.\nIts replay will be here once it ends.',
  missing: `This replay doesn't exist anymore.\nReplays are deleted ${RETENTION_DAYS} days after the game ends, unless someone has it in their favorites.`,
};

const TITLES: Record<UnavailableReason, string> = {
  errored: 'Replay unavailable',
  live: 'Game in progress',
  missing: 'Replay not found',
};

export default function GameUnavailable({
  id,
  preview,
  reason,
}: GameUnavailableProps): ReactNode {
  const [params] = useSearchParams();
  const watched = params.has('user') ? Number(params.get('user')) : undefined;
  const players = preview && matchup(preview, watched);
  const displayName = useDisplayName();
  const { revalidate, state } = useRevalidator();
  const matchupName = players && `${displayName(players[0])} vs ${displayName(players[1])}`;
  usePageTitle(matchupName ?? TITLES[reason]);

  const handleCheck = useCallback(() => revalidate(), [revalidate]);
  const user = params.get('user');
  const live = `/spectate/${id}${user ? `?${new URLSearchParams({ user }).toString()}` : ''}`;

  return (
    <Box sx={{
      margin: '24px auto', maxWidth: 480, padding: '0 16px', textAlign: 'center',
    }}
    >
      {matchupName && <Typography variant="h6">{matchupName}</Typography>}
      <Typography sx={{ marginY: 2, whiteSpace: 'pre-line' }}>
        {MESSAGES[reason]}
      </Typography>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center',
      }}
      >
        {reason === 'live' && (
          <>
            <Button color="inherit" href={live} variant="outlined">
              Watch live on Undercards
            </Button>
            <Button
              color="inherit"
              disabled={state === 'loading'}
              onClick={handleCheck}
              variant="outlined"
            >
              Check again
            </Button>
          </>
        )}
        <Button color="inherit" href="/" variant="outlined">
          Recent games
        </Button>
      </Box>
    </Box>
  );
}

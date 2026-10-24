import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useFavorites } from '~/hooks/useFavorites';
import { useTranslation } from '~/hooks/useTranslation';
import { GameRecord } from '~/structures/GameRecord';
import { daysSince, RETENTION_DAYS } from '~/utils/retention';
import { WATCH_PARAM } from '../loader';

export type OldGameGateProps = {
  record: GameRecord;
};

export default function OldGameGate({
  record: {
    date,
    key,
    type,
    users: [opponent, player],
  },
}: OldGameGateProps): ReactNode {
  const t = useTranslation();
  const displayName = useDisplayName();
  const navigate = useNavigate();
  const { toggle } = useFavorites();
  const [busy, setBusy] = useState(false);

  const watch = useCallback(() => {
    navigate({ search: `?${WATCH_PARAM}=1` }, { replace: true });
  }, [navigate]);

  const handleFavorite = useCallback(() => {
    setBusy(true);
    toggle(key)
      .then((saved) => {
        if (saved) watch();
      })
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }, [key, toggle, watch]);

  const mode = t(`game-type-${type.toLowerCase()}`, { fallback: type });

  return (
    <Box sx={{
      margin: '24px auto', maxWidth: 480, padding: '0 16px', textAlign: 'center',
    }}
    >
      <Typography variant="h6">
        {displayName(player.name)}
        {' vs '}
        {displayName(opponent.name)}
      </Typography>
      <Typography sx={{ opacity: 0.7 }}>
        {`[${mode}] ${date.toLocaleDateString()} (${daysSince(date)} days ago)`}
      </Typography>
      <Typography sx={{ marginY: 2 }}>
        {`Games are kept for ${RETENTION_DAYS} days. This one is still here because someone saved it.`}
        {' Add it to your favorites to keep it.'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          color="inherit"
          disabled={busy}
          onClick={handleFavorite}
          variant="outlined"
        >
          Add to favorites
        </Button>
        <Button
          color="inherit"
          disabled={busy}
          onClick={watch}
          variant="outlined"
        >
          Watch anyway
        </Button>
      </Box>
    </Box>
  );
}

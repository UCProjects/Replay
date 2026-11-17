import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRevalidator, useSearchParams } from 'react-router-dom';
import { LoginDialog } from '~/components/LoginDialog';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useFavorites } from '~/hooks/useFavorites';
import { usePageTitle } from '~/hooks/usePageTitle';
import { useTranslation } from '~/hooks/useTranslation';
import { useUser } from '~/hooks/useUser';
import { loginAvailable } from '~/managers/identity';
import { GamePreview, matchup } from '~/utils/gamePreview';

export type GameGateProps = {
  id: string;
  preview: GamePreview;
};

export default function GameGate({
  id,
  preview,
}: GameGateProps): ReactNode {
  const { date, type } = preview;
  const [params] = useSearchParams();
  const watched = params.has('user') ? Number(params.get('user')) : undefined;
  const players = matchup(preview, watched);
  const t = useTranslation();
  const displayName = useDisplayName();
  const { toggle } = useFavorites();
  const { revalidate } = useRevalidator();
  const [busy, setBusy] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const uid = useUser()?.uid;
  const seen = useRef(uid);

  useEffect(() => {
    if (seen.current === uid) return;
    seen.current = uid;
    revalidate();
  }, [revalidate, uid]);

  const handleFavorite = useCallback(() => {
    setBusy(true);
    toggle(id)
      .then((saved) => {
        if (saved) revalidate();
      })
      .catch(() => undefined)
      .finally(() => setBusy(false));
  }, [id, revalidate, toggle]);

  const handleSignIn = useCallback(() => setSigningIn(true), []);
  const handleCloseSignIn = useCallback(() => setSigningIn(false), []);

  const matchupName = players && `${displayName(players[0])} vs ${displayName(players[1])}`;
  usePageTitle(matchupName);

  const mode = type && t(`game-type-${type.toLowerCase()}`, { fallback: type });
  const details = [mode && `[${mode}]`, date?.toLocaleDateString()].filter(Boolean).join(' ');

  return (
    <Box sx={{
      margin: '24px auto', maxWidth: 480, padding: '0 16px', textAlign: 'center',
    }}
    >
      {matchupName && <Typography variant="h6">{matchupName}</Typography>}
      {details && <Typography sx={{ opacity: 0.7 }}>{details}</Typography>}
      <Typography sx={{ marginY: 2, whiteSpace: 'pre-line' }}>
        {uid
          ? 'This game is older than you can browse.\nAdd it to your favorites to watch it.'
          : 'Guests can only browse the most recent games.\nSign in to see more.'}
      </Typography>
      {uid && (
        <Button
          color="inherit"
          disabled={busy}
          onClick={handleFavorite}
          variant="outlined"
        >
          Add to favorites
        </Button>
      )}
      {!uid && loginAvailable && (
        <>
          <Button
            color="inherit"
            onClick={handleSignIn}
            variant="outlined"
          >
            Sign in
          </Button>
          <LoginDialog onClose={handleCloseSignIn} open={signingIn} />
        </>
      )}
    </Box>
  );
}

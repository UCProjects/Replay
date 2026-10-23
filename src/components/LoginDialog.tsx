import { GitHub, Google } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useState,
} from 'react';
import Discord from '~/assets/images/discord.svg';
import { LoginMethod, login } from '~/managers/identity';

export type LoginDialogProps = {
  onClose: () => void;
  open: boolean;
};

export function LoginDialog({
  onClose,
  open,
}: LoginDialogProps): ReactNode {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const choose = useCallback((method: LoginMethod) => () => {
    setBusy(true);
    setError('');
    login(method)
      .then(onClose)
      .catch((failure) => {
        setError(failure instanceof Error ? failure.message : 'Sign in failed');
      })
      .finally(() => setBusy(false));
  }, [onClose]);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={busy ? undefined : onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'var(--bgcolor)',
          backgroundImage: 'none',
          border: '1px solid var(--border)',
          color: 'var(--font)',
        },
      }}
    >
      <DialogTitle>Sign in</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          <Button
            color="inherit"
            disabled={busy}
            onClick={choose('discord')}
            startIcon={<Box alt="" component="img" src={Discord} sx={{ height: 20 }} />}
            variant="outlined"
          >
            Discord
          </Button>
          <Button
            color="inherit"
            disabled={busy}
            onClick={choose('github')}
            startIcon={<GitHub />}
            variant="outlined"
          >
            GitHub
          </Button>
          <Button
            color="inherit"
            disabled={busy}
            onClick={choose('google')}
            startIcon={<Google />}
            variant="outlined"
          >
            Google
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

import {
  Alert,
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
import { DIALOG_PAPER_PROPS, LOGIN_PROVIDERS } from '~/components/loginProviders';
import { LoginMethod, login } from '~/managers/identity';
import { LoginCancelled } from '~/utils/discordPopup';

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
        if (failure instanceof LoginCancelled) return;
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
      PaperProps={DIALOG_PAPER_PROPS}
    >
      <DialogTitle>Sign in</DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {LOGIN_PROVIDERS.map(({ icon, label, method }) => (
            <Button
              color="inherit"
              disabled={busy}
              key={method}
              onClick={choose(method)}
              startIcon={icon}
              variant="outlined"
            >
              {label}
            </Button>
          ))}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

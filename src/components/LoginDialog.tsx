import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { DIALOG_PAPER_PROPS, LOGIN_PROVIDERS } from '~/components/loginProviders';
import { UnavailableTip } from '~/components/UnavailableTip';
import { LoginMethod, login } from '~/managers/identity';
import { signInErrorMessage } from '~/utils/authErrors';
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
        setError(signInErrorMessage(failure));
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
          <Typography sx={{ opacity: 0.8, textAlign: 'left' }} variant="body2">
            Each sign-in method is its own account. You can link more after signing in.
          </Typography>
          {LOGIN_PROVIDERS.map(({
            icon,
            label,
            method,
            unavailable,
          }) => (
            <UnavailableTip key={method} reason={unavailable}>
              <Button
                color="inherit"
                disabled={busy || Boolean(unavailable)}
                onClick={choose(method)}
                startIcon={icon}
                variant="outlined"
              >
                {label}
              </Button>
            </UnavailableTip>
          ))}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

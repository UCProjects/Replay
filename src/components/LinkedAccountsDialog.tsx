import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { DIALOG_PAPER_PROPS, LOGIN_PROVIDERS } from '~/components/loginProviders';
import { UnavailableTip } from '~/components/UnavailableTip';
import { useLoginBlocked } from '~/hooks/useLoginBlocked';
import {
  LinkedAccounts,
  LoginMethod,
  linkAccount,
  linkedAccounts,
  login,
} from '~/managers/identity';
import { linkErrorMessage, signInErrorMessage } from '~/utils/authErrors';
import { LoginCancelled } from '~/utils/discordPopup';

export type LinkedAccountsDialogProps = {
  onClose: () => void;
  open: boolean;
};

export function LinkedAccountsDialog({
  onClose,
  open,
}: LinkedAccountsDialogProps): ReactNode {
  const [linked, setLinked] = useState<LinkedAccounts | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const blocked = useLoginBlocked();

  const refresh = useCallback(() => linkedAccounts()
    .then(setLinked)
    .catch(() => setLinked(null)), []);

  useEffect(() => {
    if (!open) return;
    setLinked(undefined);
    setError('');
    refresh();
  }, [open, refresh]);

  const run = useCallback((
    action: () => Promise<void>,
    messageOf: (failure: unknown) => string,
  ) => {
    setBusy(true);
    setError('');
    action()
      .then(refresh)
      .catch((failure) => {
        if (failure instanceof LoginCancelled) return;
        setError(messageOf(failure));
      })
      .finally(() => setBusy(false));
  }, [refresh]);

  const handleLink = useCallback(
    (method: LoginMethod) => () => run(() => linkAccount(method), linkErrorMessage),
    [run],
  );
  const handleSignIn = useCallback(
    (method: LoginMethod) => () => run(() => login(method), signInErrorMessage),
    [run],
  );

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={busy ? undefined : onClose}
      open={open}
      PaperProps={DIALOG_PAPER_PROPS}
    >
      <DialogTitle>Linked accounts</DialogTitle>
      <DialogContent sx={{ textAlign: 'left' }}>
        <Stack spacing={1}>
          {linked === undefined && (
            <Box display="flex" justifyContent="center" padding={2}>
              <CircularProgress color="inherit" size={24} />
            </Box>
          )}
          {linked === null && (
            <>
              <Typography variant="body2">
                Sign in again to manage linked accounts.
              </Typography>
              {LOGIN_PROVIDERS.map(({
                icon,
                label,
                method,
                unavailable,
              }) => (
                <UnavailableTip key={method} reason={blocked ?? unavailable}>
                  <Button
                    color="inherit"
                    disabled={busy || Boolean(blocked ?? unavailable)}
                    onClick={handleSignIn(method)}
                    startIcon={icon}
                    variant="outlined"
                  >
                    {label}
                  </Button>
                </UnavailableTip>
              ))}
            </>
          )}
          {linked && (
            <>
              <Typography variant="body2">
                Link sign-in methods to open this account with any of them.
              </Typography>
              {LOGIN_PROVIDERS.map(({
                icon,
                label,
                method,
                unavailable,
              }) => (
                <Stack alignItems="center" direction="row" key={method} minHeight={38} spacing={1.5}>
                  {icon}
                  <Box flex={1}>{label}</Box>
                  {linked[method] ? (
                    <Typography color="text.secondary" variant="body2">Linked</Typography>
                  ) : (
                    <UnavailableTip reason={blocked ?? unavailable}>
                      <Button
                        color="inherit"
                        disabled={busy || Boolean(blocked ?? unavailable)}
                        onClick={handleLink(method)}
                        size="small"
                        variant="outlined"
                      >
                        Link
                      </Button>
                    </UnavailableTip>
                  )}
                </Stack>
              ))}
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { FeaturedSeasonalAndGifts } from '~/components/FeaturedSeasonalAndGifts';
import { LoginDialog } from '~/components/LoginDialog';
import { Tip } from '~/components/Tip';
import { DIALOG_PAPER_PROPS } from '~/components/loginProviders';
import { useUser } from '~/hooks/useUser';
import {
  Account,
  buy,
  buyVoucher,
  fetchAccount,
  fetchPlans,
  redeemVoucher,
} from '~/managers/shop';
import { watchWallet } from '~/managers/identity';
import { PRO_FAVORITES } from '~/utils/favoriteRisk';
import {
  Plan,
  Plans,
  formatPrice,
  planTitle,
  slotsFull,
} from '~/utils/plans';
import { PRO_DAYS } from '~/utils/searchWindow';
import { Wallet } from '~/utils/wallet';

type Order = { gift: boolean; name: string; plan: Plan };

const BOX_SX = {
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 1,
  padding: 2,
};

function failure(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function describePlan(plan: Plan): string {
  if (plan.months) {
    return `Browse the last ${PRO_DAYS} days of games and keep up to ${PRO_FAVORITES} favorites. Adds to any Pro time you already have.`;
  }
  return 'Room for one more favorite, with or without Pro. Slots never expire.';
}

function Price({ plan }: { plan: Plan }): ReactNode {
  if (!plan.sale) return <strong>{formatPrice(plan.price, plan.currency)}</strong>;
  return (
    <span>
      <s>{formatPrice(plan.amount, plan.currency)}</s>
      {' '}
      <strong>{formatPrice(plan.price, plan.currency)}</strong>
      <Typography component="span" sx={{ display: 'block', opacity: 0.7 }} variant="body2">
        {`Sale ends ${new Date(plan.sale.until).toLocaleString()}`}
      </Typography>
    </span>
  );
}

type BalanceProps = {
  currencies: string[];
  onSignIn: () => void;
  wallet: Wallet | null | undefined;
};

function Balance({ currencies, onSignIn, wallet }: BalanceProps): ReactNode {
  if (wallet === undefined) {
    return <Typography sx={{ opacity: 0.7 }}>Loading your balance…</Typography>;
  }
  if (wallet === null) {
    return (
      <Typography>
        Sign in again to see your balance.
        {' '}
        <Button color="inherit" onClick={onSignIn} size="small" variant="outlined">Sign in</Button>
      </Typography>
    );
  }
  const shown = currencies.length ? currencies : Object.keys(wallet);
  const text = shown.length
    ? shown.map((currency) => formatPrice(wallet[currency] ?? 0, currency)).join(', ')
    : 'empty';
  return <Typography>{`Balance: ${text}`}</Typography>;
}

function AccountStatus({ account, maxSlots }: { account: Account; maxSlots?: number }): ReactNode {
  const { pro, slots } = account;
  const proText = {
    forever: 'You have Pro for good.',
    none: 'You don\'t have Pro.',
    until: pro.kind === 'until' ? `Your Pro lasts until ${pro.until.toLocaleDateString()}.` : '',
  }[pro.kind];
  return (
    <Box sx={BOX_SX}>
      <Typography>{proText}</Typography>
      <Typography>
        {`Extra favorite slots: ${slots}${maxSlots === undefined ? '' : ` of ${maxSlots}`}`}
      </Typography>
    </Box>
  );
}

const CODE_SX = {
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  borderRadius: 0.5,
  fontFamily: 'monospace',
  fontSize: '0.95em',
  paddingX: 0.5,
};

function ConfirmText({ account, order }: { account: Account | null; order: Order }): ReactNode {
  const { gift, plan } = order;
  const price = formatPrice(plan.price, plan.currency);
  const lines = [
    gift ? ' You get a code to give to someone, and they redeem it here.' : '',
    !gift && plan.months && account?.pro.kind === 'until'
      ? ` It is added to your current Pro, which ends ${account.pro.until.toLocaleDateString()}.`
      : '',
    ' It is charged to your wallet and can\'t be refunded.',
  ];
  return (
    <>
      {gift ? 'Buy a voucher for ' : 'Buy '}
      <Box component="code" sx={CODE_SX}>{planTitle(plan)}</Box>
      {` for ${price}?`}
      {lines.join('')}
    </>
  );
}

export default function Shop(): ReactNode {
  const user = useUser();
  const [plans, setPlans] = useState<Plans | undefined>(undefined);
  const [account, setAccount] = useState<Account | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [voucher, setVoucher] = useState('');
  const [code, setCode] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null | undefined>(undefined);

  useEffect(() => {
    setWallet(undefined);
    return user ? watchWallet(setWallet) : undefined;
  }, [user]);

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch((reason) => {
        setPlans({});
        setError(failure(reason, 'Could not load prices'));
      });
  }, []);

  const refreshAccount = useCallback(() => fetchAccount()
    .then(setAccount)
    .catch(() => setAccount(null)), []);

  useEffect(() => {
    setAccount(null);
    if (user) refreshAccount();
  }, [refreshAccount, user]);

  const run = useCallback((action: () => Promise<string>) => {
    setBusy(true);
    setError('');
    setNotice('');
    action()
      .then(setNotice)
      .catch((reason) => setError(failure(reason, 'Something went wrong')))
      .then(refreshAccount)
      .finally(() => setBusy(false));
  }, [refreshAccount]);

  const choose = useCallback((next: Order) => () => {
    if (!user) {
      setSigningIn(true);
      return;
    }
    setOrder(next);
    setConfirming(true);
  }, [user]);

  const handleCancel = useCallback(() => setConfirming(false), []);

  const handleConfirm = useCallback(() => {
    if (!order) return;
    setConfirming(false);
    if (order.gift) {
      run(() => buyVoucher(order.name).then((bought) => {
        setVoucher(bought);
        return '';
      }));
      return;
    }
    run(() => buy(order.name).then(() => `Thanks! ${planTitle(order.plan)} is yours.`));
  }, [order, run]);

  const handleRedeem = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (!user) {
      setSigningIn(true);
      return;
    }
    const input = code.trim();
    if (!input) return;
    run(() => redeemVoucher(input).then(() => {
      setCode('');
      return 'Voucher redeemed. Enjoy your Pro!';
    }));
  }, [code, run, user]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(voucher).catch(() => undefined);
  }, [voucher]);

  const handleOpenSignIn = useCallback(() => setSigningIn(true), []);
  const handleCloseSignIn = useCallback(() => setSigningIn(false), []);
  const currencies = [...new Set(Object.values(plans ?? {}).map(({ currency }) => currency))];

  const forever = account?.pro.kind === 'forever';
  const maxSlots = Object.values(plans ?? {}).find((plan) => plan.maxSlots)?.maxSlots;
  const unavailable = (plan: Plan): boolean => (plan.months
    ? forever
    : slotsFull(plan, account?.slots ?? 0));

  return (
    <Box sx={{
      maxWidth: 720, padding: 2, textAlign: 'left', width: '100%',
    }}
    >
      <Stack spacing={2}>
        {user && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Balance currencies={currencies} onSignIn={handleOpenSignIn} wallet={wallet} />
          </Box>
        )}
        {!user && (
          <Alert severity="info">Sign in to buy. Purchases are charged to your wallet.</Alert>
        )}
        {account && <AccountStatus account={account} maxSlots={maxSlots} />}
        {busy && (
          <Alert icon={<CircularProgress color="inherit" size={20} />} severity="info">
            Processing… this can take a few seconds.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {notice && <Alert severity="success">{notice}</Alert>}
        {voucher && (
          <Alert
            action={<Button color="inherit" onClick={handleCopy} size="small">Copy</Button>}
            severity="success"
          >
            {'Your voucher code: '}
            <strong>{voucher}</strong>
          </Alert>
        )}
        {plans === undefined && (
          <Box display="flex" justifyContent="center" padding={2}>
            <CircularProgress color="inherit" size={24} />
          </Box>
        )}
        {plans && Object.entries(plans).map(([name, plan]) => (
          <Box key={name} sx={BOX_SX}>
            <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h6">{planTitle(plan)}</Typography>
                <Typography sx={{ opacity: 0.8 }} variant="body2">{describePlan(plan)}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                <Price plan={plan} />
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ marginTop: 1 }}>
              {plan.months && (
                <Tip title="Buy as a gift">
                  <span>
                    <IconButton
                      aria-label="Buy as a gift"
                      color="inherit"
                      disabled={busy}
                      onClick={choose({ gift: true, name, plan })}
                      size="small"
                    >
                      <FeaturedSeasonalAndGifts fontSize="small" />
                    </IconButton>
                  </span>
                </Tip>
              )}
              <Button
                color="inherit"
                disabled={busy || unavailable(plan)}
                onClick={choose({ gift: false, name, plan })}
                size="small"
                variant="outlined"
              >
                Buy
              </Button>
            </Stack>
          </Box>
        ))}
        <Box component="form" onSubmit={handleRedeem} sx={BOX_SX}>
          <Typography sx={{ marginBottom: 1 }} variant="h6">Redeem a voucher</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              inputProps={{ 'aria-label': 'Voucher code' }}
              onChange={(event) => setCode(event.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              size="small"
              value={code}
            />
            <Button
              color="inherit"
              disabled={busy || (Boolean(user) && !code.trim())}
              type="submit"
              variant="outlined"
            >
              Redeem
            </Button>
          </Stack>
        </Box>
        <Box sx={BOX_SX}>
          <Typography sx={{ marginBottom: 1 }} variant="h6">Getting FMC</Typography>
          <Typography variant="body2">
            FMC comes from sponsoring on
            {' '}
            <a href="https://github.com/sponsors/feildmaster" rel="noreferrer" target="_blank">GitHub Sponsors</a>
            . Link the GitHub account you sponsor with to receive it.
            Credits can take up to 12 hours to arrive.
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.7 }} variant="body2">
          Purchases can&apos;t be refunded. See your balance and history at
          {' '}
          <a href="https://wallet.feildmaster.com/" rel="noreferrer" target="_blank">wallet.feildmaster.com</a>
          .
        </Typography>
      </Stack>
      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCancel}
        open={confirming}
        PaperProps={DIALOG_PAPER_PROPS}
      >
        <DialogTitle>{order?.gift ? 'Buy a voucher?' : 'Confirm purchase'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'inherit', textAlign: 'left' }}>
            {order && <ConfirmText account={account} order={order} />}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCancel}>Cancel</Button>
          <Button color="inherit" onClick={handleConfirm} variant="outlined">Buy</Button>
        </DialogActions>
      </Dialog>
      <LoginDialog onClose={handleCloseSignIn} open={signingIn} />
    </Box>
  );
}

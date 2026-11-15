import {
  ContentCopy,
  EmojiEvents,
  Favorite,
  FavoriteBorder,
  Home,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Link } from '~/components/Link';
import { DIALOG_PAPER_PROPS } from '~/components/loginProviders';
import { useFavorites } from '~/hooks/useFavorites';
import { useGame } from '~/hooks/useGame';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useTranslation } from '~/hooks/useTranslation';
import { expiresSoonAfterUnfavorite } from '~/utils/favoriteRisk';

export type GameMenuProps = {
  onClose: () => void;
  onResults?: () => void;
  open: boolean;
};

export default function GameMenu({
  onClose,
  onResults = undefined,
  open,
}: GameMenuProps): ReactNode {
  const t = useTranslation();
  const displayName = useDisplayName();
  const { isFavorite, toggle } = useFavorites();
  const {
    date,
    key,
    results,
    start,
    type,
    users: [opponent, player],
  } = useGame();
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, []);

  const favorite = isFavorite(key);

  const save = useCallback(() => {
    toggle(key).catch(() => undefined);
  }, [key, toggle]);

  const handleFavorite = useCallback(() => {
    if (favorite && expiresSoonAfterUnfavorite(date)) {
      setConfirming(true);
      return;
    }
    save();
  }, [date, favorite, save]);

  const handleCancel = useCallback(() => setConfirming(false), []);
  const handleConfirm = useCallback(() => {
    setConfirming(false);
    save();
  }, [save]);

  const mode = t(`game-type-${type.toLowerCase()}`, { fallback: type });
  const reason = t(results.type, { fallback: results.type });

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderRight: '1px solid #fff',
          color: 'white',
          maxWidth: '85vw',
          width: 300,
        },
      }}
    >
      <Box sx={{ padding: '16px' }}>
        <Typography variant="h6">
          {displayName(player.name)}
          {' vs '}
          {displayName(opponent.name)}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'white' }} />
      <List disablePadding>
        <ListItem>
          <ListItemText
            primary={`[${mode}]`}
            secondary={start.toLocaleString()}
            secondaryTypographyProps={{ sx: { color: 'inherit', opacity: 0.7 } }}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={results.winner ? `${displayName(results.winner.name)} won` : 'No winner'}
            secondary={reason}
            secondaryTypographyProps={{ sx: { color: 'inherit', opacity: 0.7 } }}
          />
        </ListItem>
        {onResults && (
          <ListItemButton
            onClick={onResults}
            sx={{ color: 'inherit' }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}><EmojiEvents /></ListItemIcon>
            <ListItemText primary="Results" />
          </ListItemButton>
        )}
        <Divider
          component="li"
          sx={{ borderColor: 'white' }}
        />
        <ListItemButton
          component={Link}
          sx={{ color: 'inherit' }}
          to="/"
        >
          <ListItemIcon sx={{ color: 'inherit' }}><Home /></ListItemIcon>
          <ListItemText primary="Recent games" />
        </ListItemButton>
        <ListItemButton
          onClick={handleFavorite}
          sx={{ color: 'inherit' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}>
            {favorite ? <Favorite sx={{ color: '#bf3989' }} /> : <FavoriteBorder />}
          </ListItemIcon>
          <ListItemText primary={favorite ? 'Remove from favorites' : 'Add to favorites'} />
        </ListItemButton>
        <ListItemButton
          onClick={handleCopy}
          sx={{ color: 'inherit' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><ContentCopy /></ListItemIcon>
          <ListItemText primary={copied ? 'Link copied' : 'Copy link'} />
        </ListItemButton>
      </List>
      <Dialog
        fullWidth
        maxWidth="xs"
        onClose={handleCancel}
        open={confirming}
        PaperProps={DIALOG_PAPER_PROPS}
      >
        <DialogTitle>Remove from favorites?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'inherit', textAlign: 'left' }}>
            You won&apos;t be able to add this game back for a day, and it could be deleted by then.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCancel}>Keep it</Button>
          <Button color="error" onClick={handleConfirm} variant="outlined">Remove</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}

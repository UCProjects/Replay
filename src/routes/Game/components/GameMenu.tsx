import {
  ContentCopy,
  Home,
} from '@mui/icons-material';
import {
  Box,
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
import { useGame } from '~/hooks/useGame';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useTranslation } from '~/hooks/useTranslation';

export type GameMenuProps = {
  onClose: () => void;
  open: boolean;
};

export default function GameMenu({
  onClose,
  open,
}: GameMenuProps): ReactNode {
  const t = useTranslation();
  const displayName = useDisplayName();
  const {
    results,
    start,
    type,
    users: [opponent, player],
  } = useGame();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, []);

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
          onClick={handleCopy}
          sx={{ color: 'inherit' }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><ContentCopy /></ListItemIcon>
          <ListItemText primary={copied ? 'Link copied' : 'Copy link'} />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

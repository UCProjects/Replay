import {
  ArrowDropDown,
  Login,
  Logout,
  ManageAccounts,
  Settings,
} from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react';

import { Flex } from '~/components/Flex';
import { LinkedAccountsDialog } from '~/components/LinkedAccountsDialog';
import { Link } from '~/components/Link';
import { LoginDialog } from '~/components/LoginDialog';
import { DIALOG_PAPER_PROPS } from '~/components/loginProviders';
import { SettingsDialog } from '~/components/SettingsDialog';
import { Tip } from '~/components/Tip';
import { useUser, useUserName } from '~/hooks/useUser';
import { loginAvailable, logout } from '~/managers/identity';

const ICON_SX = { flexShrink: 0, marginLeft: '8px', padding: 0 };

const USER_BUTTON_SX = {
  font: 'inherit',
  minWidth: 0,
  padding: '0 0 0 4px',
  textTransform: 'none',
  '& .MuiButton-endIcon': { marginLeft: 0 },
};

const NAME_SX = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const ITEM_ICON_SX = { color: 'inherit' };

export default function Header(): ReactNode {
  const user = useUser();
  const name = useUserName();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [managingLinks, setManagingLinks] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget),
    [],
  );
  const handleCloseMenu = useCallback(() => setMenuAnchor(null), []);
  const fromMenu = useCallback((action: () => void) => () => {
    setMenuAnchor(null);
    action();
  }, []);

  const handleOpen = useCallback(() => setSigningIn(true), []);
  const handleClose = useCallback(() => setSigningIn(false), []);
  const handleCloseLinked = useCallback(() => setManagingLinks(false), []);
  const handleCloseSettings = useCallback(() => setSettingsOpen(false), []);

  return (
    <Flex
      alignItems="center"
      className="site-header"
      component="header"
      container
      justifyContent="space-between"
      marginY="5px"
      wrap="nowrap"
    >
      <Flex sx={{ flexShrink: 0, marginRight: '8px' }} xs="auto">
        <Link
          to="/"
        >
          Undercards Replay
        </Link>
      </Flex>
      <Flex
        alignItems="center"
        container
        justifyContent="flex-end"
        minWidth={0}
        wrap="nowrap"
        xs
      >
        <Button
          aria-controls={menuAnchor ? 'user-menu' : undefined}
          aria-expanded={menuAnchor ? 'true' : undefined}
          aria-haspopup="menu"
          color="inherit"
          endIcon={<ArrowDropDown />}
          onClick={handleOpenMenu}
          sx={USER_BUTTON_SX}
          title={name}
        >
          <Box component="span" sx={NAME_SX}>{name}</Box>
        </Button>
        {!user && loginAvailable && (
          <Tip title="Sign in">
            <IconButton aria-label="Sign in" color="inherit" onClick={handleOpen} sx={ICON_SX}>
              <Login />
            </IconButton>
          </Tip>
        )}
      </Flex>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="user-menu"
        MenuListProps={{ sx: { textAlign: 'left' } }}
        onClose={handleCloseMenu}
        open={Boolean(menuAnchor)}
        PaperProps={DIALOG_PAPER_PROPS}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem onClick={fromMenu(() => setSettingsOpen(true))}>
          <ListItemIcon sx={ITEM_ICON_SX}><Settings /></ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        {user && (
          <MenuItem onClick={fromMenu(() => setManagingLinks(true))}>
            <ListItemIcon sx={ITEM_ICON_SX}><ManageAccounts /></ListItemIcon>
            <ListItemText>Linked accounts</ListItemText>
          </MenuItem>
        )}
        {user && (
          <MenuItem onClick={fromMenu(() => { logout().catch(() => undefined); })}>
            <ListItemIcon sx={ITEM_ICON_SX}><Logout /></ListItemIcon>
            <ListItemText>Sign out</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <LoginDialog onClose={handleClose} open={signingIn} />
      <LinkedAccountsDialog onClose={handleCloseLinked} open={managingLinks} />
      <SettingsDialog onClose={handleCloseSettings} open={settingsOpen} />
    </Flex>
  );
}

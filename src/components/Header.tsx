import {
  Login,
  Logout,
  ManageAccounts,
  Settings,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ReactNode, useCallback, useState } from 'react';

import { Flex } from '~/components/Flex';
import { LinkedAccountsDialog } from '~/components/LinkedAccountsDialog';
import { Link } from '~/components/Link';
import { LoginDialog } from '~/components/LoginDialog';
import { SettingsDialog } from '~/components/SettingsDialog';
import { Tip } from '~/components/Tip';
import { useTranslation } from '~/hooks/useTranslation';
import { useUser, useUserName } from '~/hooks/useUser';
import { loginAvailable, logout } from '~/managers/identity';

const ICON_SX = { marginLeft: '8px', padding: 0 };

export default function Header(): ReactNode {
  const t = useTranslation();
  const user = useUser();
  const name = useUserName();
  const [signingIn, setSigningIn] = useState(false);
  const handleOpen = useCallback(() => setSigningIn(true), []);
  const handleClose = useCallback(() => setSigningIn(false), []);
  const [managingLinks, setManagingLinks] = useState(false);
  const handleOpenLinked = useCallback(() => setManagingLinks(true), []);
  const handleCloseLinked = useCallback(() => setManagingLinks(false), []);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const handleOpenSettings = useCallback(() => setSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setSettingsOpen(false), []);
  const handleLogout = useCallback(() => {
    logout().catch(() => undefined);
  }, []);
  return (
    <Flex
      alignItems="center"
      className="site-header"
      component="header"
      container
      justifyContent="space-between"
      marginY="5px"
    >
      <Flex xs="auto">
        <Link
          to="/"
        >
          Undercards Replay
        </Link>
      </Flex>
      <Flex
        alignItems="center"
        container
        xs="auto"
      >
        <span>
          {t('replay-welcome', name)}
        </span>
        <Tip title="Settings">
          <IconButton aria-label="Settings" color="inherit" onClick={handleOpenSettings} sx={ICON_SX}>
            <Settings />
          </IconButton>
        </Tip>
        {user && (
          <Tip title="Linked accounts">
            <IconButton aria-label="Linked accounts" color="inherit" onClick={handleOpenLinked} sx={ICON_SX}>
              <ManageAccounts />
            </IconButton>
          </Tip>
        )}
        {user && (
          <Tip title="Sign out">
            <IconButton aria-label="Sign out" color="inherit" onClick={handleLogout} sx={ICON_SX}>
              <Logout />
            </IconButton>
          </Tip>
        )}
        {!user && loginAvailable && (
          <Tip title="Sign in">
            <IconButton aria-label="Sign in" color="inherit" onClick={handleOpen} sx={ICON_SX}>
              <Login />
            </IconButton>
          </Tip>
        )}
      </Flex>
      <LoginDialog onClose={handleClose} open={signingIn} />
      <LinkedAccountsDialog onClose={handleCloseLinked} open={managingLinks} />
      <SettingsDialog onClose={handleCloseSettings} open={settingsOpen} />
    </Flex>
  );
}

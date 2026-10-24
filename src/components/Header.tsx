import { Login, Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { ReactNode, useCallback, useState } from 'react';

import { Flex } from '~/components/Flex';
import { Link } from '~/components/Link';
import { LoginDialog } from '~/components/LoginDialog';
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
        {user && (
          <IconButton aria-label="Sign out" color="inherit" onClick={handleLogout} sx={ICON_SX}>
            <Logout />
          </IconButton>
        )}
        {!user && loginAvailable && (
          <IconButton aria-label="Sign in" color="inherit" onClick={handleOpen} sx={ICON_SX}>
            <Login />
          </IconButton>
        )}
      </Flex>
      <LoginDialog onClose={handleClose} open={signingIn} />
    </Flex>
  );
}

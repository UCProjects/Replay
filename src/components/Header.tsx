import {
  Login,
  Logout,
  Settings,
} from '@mui/icons-material';
import { ReactNode } from 'react';

import { Flex } from '~/components/Flex.tsx';
import { useTranslation } from '~/hooks/useTranslation';
import { useUser } from '~/hooks/useUser.ts';
import Link from './Link';

export default function Header(): ReactNode {
  const t = useTranslation();
  const user = useUser();
  // TODO: Handle buttons
  return (
    <Flex
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
        container
        xs="auto"
      >
        <span>
          {t('replay-welcome', user?.displayName || 'Guest')}
        </span>
        {user && <Logout />}
        {user && <Settings className="hidden" />}
        {!user && <Login />}
      </Flex>
    </Flex>
  );
}

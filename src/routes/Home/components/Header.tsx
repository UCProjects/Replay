import {
  Login,
  Logout,
  Settings,
} from '@mui/icons-material';
import { ReactNode } from 'react';

import Flex from '../../../components/Flex.tsx';
import { useUser } from '../../../hooks/useUser.ts';

export default function Header(): ReactNode {
  const user = useUser();
  // TODO: Handle buttons
  return (
    <Flex
      container
      component="header"
      justifyContent="space-between"
    >
      <Flex xs="auto">
        Undercards Replay
      </Flex>
      <Flex
        container
        xs="auto"
      >
        <span>
          Welcome,&nbsp;
          <span id="username">{user?.displayName || 'Guest'}</span>
          .
        </span>
        {user && <Logout />}
        {user && <Settings className="hidden" />}
        {!user && <Login />}
      </Flex>
    </Flex>
  );
}

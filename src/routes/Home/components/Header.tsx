import {
  Login,
  Logout,
  Settings,
} from '@mui/icons-material';
import { ReactNode } from 'react';

import Flex from '../../../components/Flex.tsx';

export default function Header(): ReactNode {
  // TODO: get user and include logout/login based on user
  // TODO: Handle login/logout
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
          <span id="username">Guest</span>
          .
        </span>
        <Logout className="authed" />
        <Settings className="authed hidden" />
        <Login className="unauthed" />
      </Flex>
    </Flex>
  );
}

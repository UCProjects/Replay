import { ReactNode } from 'react';
import { SxProps } from '@mui/material';

import Flex from '../../../components/Flex.tsx';
import DiscordLogo from '../../../assets/images/discord+word.svg';

const style: SxProps = {
  flexBasis: {
    xs: 'auto',
    md: '100%',
  },
};

export default function Footer(): ReactNode {
  return (
    <>
      <Flex sx={style}>
        <a href="https://discord.gg/B9sX8mT" rel="noreferrer" target="_blank">
          <img alt="discord" src={DiscordLogo} />
        </a>
      </Flex>
      <Flex sx={style}>
        <iframe
          height="32"
          src="https://github.com/sponsors/feildmaster/button"
          style={{
            border: 0,
            borderRadius: 0,
          }}
          title="Sponsor feildmaster"
          width="114"
        />
      </Flex>
      <Flex sx={style}>
        <a href="https://undercards.net/" rel="noreferrer" target="_blank">Undercards</a>
        &nbsp;by Onutrem
      </Flex>
    </>
  );
}

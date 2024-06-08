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
        <a href="https://discord.gg/B9sX8mT" target="_blank" rel="noreferrer">
          <img alt="discord" src={DiscordLogo} />
        </a>
      </Flex>
      <Flex sx={style}>
        <iframe
          src="https://github.com/sponsors/feildmaster/button"
          title="Sponsor feildmaster"
          height="32"
          width="114"
          style={{
            border: 0,
            borderRadius: 0,
          }}
        />
      </Flex>
      <Flex sx={style}>
        <a href="https://undercards.net/" target="_blank" rel="noreferrer">Undercards</a>
        &nbsp;by Onutrem
      </Flex>
    </>
  );
}

import { ReactNode, useMemo } from 'react';
import { SxProps, useMediaQuery, useTheme } from '@mui/material';

import Flex from '../../../components/Flex.tsx';
import DiscordLogo from '../../../assets/images/discord+word.svg';
import DiscordAlt from '../../../assets/images/discord.svg';

const style: SxProps = {
  flexBasis: {
    xs: 'auto',
    md: '100%',
  },
};

export default function Footer(): ReactNode {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down('sm'));
  const discordImg = useMemo(() => {
    if (small) return DiscordAlt;
    return DiscordLogo;
  }, [small]);
  return (
    <>
      <Flex
        sx={{
          ...style,
          marginBottom: '-4px',
        }}
      >
        <a href="https://discord.gg/B9sX8mT" rel="noreferrer" target="_blank">
          <img
            alt="discord"
            height={40}
            src={discordImg}
          />
        </a>
      </Flex>
      <Flex
        key="sponsor button"
        sx={{
          ...style,
          alignSelf: 'flex-end',
        }}
      >
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
        {!small && ' by Onutrem'}
      </Flex>
    </>
  );
}

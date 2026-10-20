import { ReactNode, useMemo } from 'react';
import { FavoriteBorder } from '@mui/icons-material';
import {
  Button,
  SxProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { Flex } from '~/components/Flex.tsx';
import DiscordLogo from '~/assets/images/discord+word.svg';
import DiscordAlt from '~/assets/images/discord.svg';

const style: SxProps = {
  alignSelf: 'center',
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
  const heart = <FavoriteBorder sx={{ color: '#bf3989' }} />;
  return (
    <>
      <Flex
        sx={{
          ...style,
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
        }}
      >
        <Button
          color="inherit"
          href="https://github.com/sponsors/feildmaster"
          rel="noreferrer"
          size="small"
          startIcon={small ? undefined : heart}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.3)',
            minWidth: 0,
            textTransform: 'none',
          }}
          target="_blank"
          title="Sponsor feildmaster"
          variant="outlined"
        >
          {small ? heart : 'Sponsor'}
        </Button>
      </Flex>
      <Flex sx={style}>
        <a href="https://undercards.net/" rel="noreferrer" target="_blank">Undercards</a>
        {!small && ' by Onutrem'}
      </Flex>
    </>
  );
}

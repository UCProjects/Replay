import {
  ReactNode,
} from 'react';
import { Box } from '@mui/material';

import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Flex from '../../components/Flex.tsx';
import GameList from '../../components/GameList/index.tsx';
import Navigation from './components/Navigation/index.tsx';
import './home.css';

export default function Home(): ReactNode {
  // TODO: Provide GameList with "default" results
  return (
    <Box>
      <Header />
      <Flex
        container
        disableEqualOverflow
        alignItems="flex-start"
        alignContent="flex-start"
      >
        <Flex
          xs={12}
          md="auto"
        >
          <Navigation />
        </Flex>
        <GameList
          title="Recent Games"
        />
      </Flex>
      <Flex
        xs={12}
        container
        component="footer"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          position: 'sticky',
          bottom: 0,
        }}
      >
        <Footer />
      </Flex>
    </Box>
  );
}

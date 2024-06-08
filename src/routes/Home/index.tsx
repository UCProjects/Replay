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
        alignContent="flex-start"
        alignItems="flex-start"
        container
        disableEqualOverflow
      >
        <Flex
          md="auto"
          xs={12}
        >
          <Navigation />
        </Flex>
        <GameList
          title="Recent Games"
        />
      </Flex>
      <Flex
        alignItems="center"
        component="footer"
        container
        justifyContent="space-evenly"
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          position: 'sticky',
          bottom: 0,
        }}
        xs={12}
      >
        <Footer />
      </Flex>
    </Box>
  );
}

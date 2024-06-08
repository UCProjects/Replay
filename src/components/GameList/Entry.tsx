import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { GameRecord } from '../../structures/GameRecord';

export default function Entry({
  key,
}: GameRecord): ReactNode {
  // TODO
  return (
    <Box key={key} />
  );
}

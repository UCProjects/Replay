import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { CardType, Family } from '~/types/card';
import { Slot } from '~/types/game';

export type FooterProps = {
  data: Slot;
};

// TODO: HP can have status effects
export function Footer({
  data,
}: FooterProps): ReactNode {
  if (!data) {
    // Spoof a footer so the board spacing is correct
    return (
      <Stack
        className="card-bottom"
        direction="row"
      />
    );
  }

  const {
    // I strip "0" from the game data... so we need to give it a default.
    type = CardType.MONSTER,
  } = data;
  const isMonster = type === CardType.MONSTER;
  return (
    <Stack
      className="card-bottom"
      direction="row"
    >
      {isMonster && (
        <div className="card-attack">{data.attack}</div>
      )}
      <Box
        className="card-rarity"
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          alt={data.rarity}
          className="rarity"
          draggable="false"
          src={`/images/rarity/${data.rarity}${getType(data.extension)}.png`}
        />
      </Box>
      {isMonster && (
        <div className="card-health">{data.hp}</div>
      )}
    </Stack>
  );
}

function getType(type: Family): string {
  switch (type) {
    case Family.UT: return '';
    case Family.DR: return '_DR';
    default: return `_${type}`;
  }
}

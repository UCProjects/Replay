import { Stack } from '@mui/material';
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
  const isMonster = data?.type === CardType.MONSTER;
  return (
    <Stack
      className="card-bottom"
      direction="row"
    >
      {isMonster && (
        <div className="card-attack">{data.attack}</div>
      )}
      <div className="card-rarity center-v center-h">
        <img
          alt={data?.rarity || 'rarity'}
          className="rarity"
          draggable="false"
          src={data ? `/images/rarity/${data.rarity}${getType(data.extension)}.png` : ''}
        />
      </div>
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

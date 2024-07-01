import { Box, styled } from '@mui/material';
import {
  PropsWithChildren,
  ReactNode,
  useMemo,
} from 'react';
import { Monster } from '~/types/card';
import { WithSlot } from '~/types/game';
import { isMonster } from '~/utils/isCard';
import { getType } from './utils';

const Rarity = styled(Box)({
  alignItems: 'center',
  className: 'card-rarity',
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'center',
});

function MonsterBar({
  children,
  monster: {
    attack = 0,
    hp = 0,
  },
}: PropsWithChildren<{ monster: Monster }>) {
  return (
    <>
      <div className="card-attack">{attack}</div>
      {children}
      <div className="card-health">{hp}</div>
    </>
  );
}

// TODO: HP can have status effects
export function Footer({
  data,
}: WithSlot): ReactNode {
  const rarity = useMemo(() => {
    if (!data) return null;
    return (
      <Rarity>
        <img
          alt={data.rarity}
          className="rarity"
          draggable="false"
          src={`/images/rarity/${data.rarity}${getType(data.extension)}.png`}
        />
      </Rarity>
    );
  }, [data]);

  if (!data) return null;

  return (isMonster(data) ? (
    <MonsterBar monster={data}>
      {rarity}
    </MonsterBar>
  ) : (
    rarity
  ));
}

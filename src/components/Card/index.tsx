import { Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from '~/hooks/useTranslation';
import { Slot } from '~/types/game';
import { Status } from './Status';
import { Tribes } from './Tribes';
import './card.css';

export type CardProps = {
  data: Slot;
};

// TODO: Resizable component for name/description
export function Card({
  data,
}: CardProps): ReactNode {
  const t = useTranslation();
  return (
    <Stack
      className="card"
      visibility={data ? 'visible' : 'hidden'}
    >
      <Stack
        className="card-top"
        direction="row"
      >
        <div className="card-name">
          {data && t(`card-name-${data.id}`)}
        </div>
        <div className="card-cost">
          {data?.cost}
        </div>
      </Stack>
      <div className="card-image">
        <img
          alt="avatar"
          className="card-avatar"
          draggable="false"
          src={data ? `/images/cards/${data.name}.png` : ''}
        />
        <div className="name outlined">
          {data && t(`card-name-${data.id}`)}
        </div>
        <Status data={data} />
        <Tribes data={data} />
      </div>
      <div className="card-description center-v center-h">
        <span>{data ? t(`card-${data.id}`) : ''}</span>
      </div>
    </Stack>
  );
}

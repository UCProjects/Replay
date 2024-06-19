import { Box, Stack } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from '~/hooks/useTranslation';
import { Slot } from '~/types/game';
import { Status } from './Status';
import { Tribes } from './Tribes';
import './card.css';
import { Footer } from './Footer';

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
      bgcolor="var(--bgcolor)"
      className="card"
      visibility={data ? 'visible' : 'hidden'}
    >
      <Stack
        className="card-top"
        direction="row"
      >
        <Box
          className="card-name"
          dangerouslySetInnerHTML={data ? {
            __html: t(`card-name-${data.fixedId}`, '1'),
          } : undefined}
          textAlign="left"
        />
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
        <Box
          className="name outlined"
          dangerouslySetInnerHTML={data ? {
            __html: t(`card-name-${data.fixedId}`, '1'),
          } : undefined}
        />
        <Status data={data} />
        <Tribes data={data} />
      </div>
      <div className="card-description center-v center-h">
        <Box
          dangerouslySetInnerHTML={data ? {
            __html: t(`card-${data.fixedId}`),
          } : undefined}
        />
      </div>
      <Footer data={data} />
    </Stack>
  );
}

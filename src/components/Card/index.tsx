import { Stack } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from '~/hooks/useTranslation';
import { Slot } from '~/types/game';
import { Status } from './Status';
import { Tribes } from './Tribes';
import './card.css';
import { Footer } from './Footer';
import { FitText } from '../FitText';

export type CardProps = {
  data: Slot;
};

// TODO: Resizable component for name/description
export function Card({
  data,
}: CardProps): ReactNode {
  const t = useTranslation();
  const name = useMemo(() => {
    if (data?.fixedId) return t(`card-name-${data.fixedId}`, '1');
    return '';
  }, [
    data?.fixedId,
    t,
  ]);

  return (
    <Stack
      bgcolor="var(--bgcolor)"
      className="card"
      visibility={data ? 'visible' : 'hidden'}
    >
      <Stack
        className="card-top"
        direction="row"
        display={{
          sm: 'flex',
          xs: 'none',
        }}
      >
        <FitText
          className="card-name"
          fitHeight={false}
          size={15}
          textAlign="left"
        >
          {name}
        </FitText>
        <div className="card-cost">
          {data?.cost}
        </div>
      </Stack>
      <div className="card-image">
        <img
          alt="avatar"
          className="card-avatar"
          draggable="false"
          src={data ? `/images/cards/${data.name.replace(/ /g, '_')}.png` : ''}
        />
        <FitText
          className="name outlined"
          fitHeight={false}
          size={13}
        >
          {name}
        </FitText>
        <Status data={data} />
        <Tribes data={data} />
      </div>
      <div className="card-description center-v center-h">
        <FitText
          fitBoth
          html={data ? t(`card-${data.fixedId}`) : ''}
        />
      </div>
      <Footer data={data} />
    </Stack>
  );
}

import { Dialog } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { Card } from '~/components/Card';
import { WithSlot } from '~/types/game';

const MAX_ZOOM = 1.6;
const CARD_WIDTH = 170;
const CARD_HEIGHT = 260;
const GAP = 24;

function fitZoom(): number {
  return Math.min(
    MAX_ZOOM,
    (window.innerWidth - GAP) / CARD_WIDTH,
    (window.innerHeight - GAP) / CARD_HEIGHT,
  );
}

function useFitZoom(): number {
  const [zoom, setZoom] = useState(fitZoom);
  useEffect(() => {
    const handleResize = () => setZoom(fitZoom());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return zoom;
}

export type CardZoomProps = WithSlot<{
  onClose: () => void;
  open: boolean;
}>;

export function CardZoom({
  data,
  onClose,
  open,
}: CardZoomProps): ReactNode {
  const zoom = useFitZoom();

  return (
    <Dialog
      onClose={onClose}
      open={open && Boolean(data)}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          fontFamily: 'DTM-Mono',
          margin: 0,
          maxHeight: 'none',
          maxWidth: 'none',
          overflow: 'visible',
          zoom,
        },
      }}
      sx={{ '& .MuiDialog-container': { alignItems: 'center' } }}
    >
      <Card data={data} full />
    </Dialog>
  );
}

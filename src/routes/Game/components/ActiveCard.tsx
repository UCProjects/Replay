import { Box } from '@mui/material';
import { Card } from '~/components/Card';
import { useActiveSlot } from '~/hooks/useGame';

export default function ActiveCard() {
  const slot = useActiveSlot();
  return (
    <Box
      aria-hidden={slot == null}
      sx={{
        filter: 'drop-shadow(0 0 12px black)',
        left: '50%',
        pointerEvents: 'none',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      <Card
        data={slot}
        full
      />
    </Box>
  );
}

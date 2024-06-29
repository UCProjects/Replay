import { Dialog } from '@mui/material';
import { Card } from '~/components/Card';
import { useActiveSlot } from '~/hooks/useGame';

export default function ActiveCard() {
  const slot = useActiveSlot();
  return (
    <Dialog
      hideBackdrop
      open={slot != null}
    >
      <Card data={slot} />
    </Dialog>
  );
}

import { ReactNode } from 'react';
import { WithSlot } from '~/types/game';

export function Status({
  data = null,
}: WithSlot): ReactNode {
  if (!data) return null;
  return (
    <div className="card-status" />
  );
}

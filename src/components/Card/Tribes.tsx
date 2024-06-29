import { ReactNode } from 'react';
import { WithSlot } from '~/types/game';

export function Tribes({
  data = null,
}: WithSlot): ReactNode {
  if (!data) return null;
  return (
    <div className="card-tribes" />
  );
}

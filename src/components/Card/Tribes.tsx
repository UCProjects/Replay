import { ReactNode } from 'react';
import { Slot } from '~/types/game';

export type TribeProps = {
  data?: Slot;
};

export function Tribes({
  data = null,
}: TribeProps): ReactNode {
  if (!data) return null;
  return (
    <div className="card-tribes" />
  );
}

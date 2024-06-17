import { ReactNode } from 'react';
import { Slot } from '~/types/game';

export type StatusProps = {
  data?: Slot;
};

export function Status({
  data = null,
}: StatusProps): ReactNode {
  if (!data) return null;
  return (
    <div className="card-status" />
  );
}

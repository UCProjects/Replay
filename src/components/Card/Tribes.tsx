import { ReactNode } from 'react';
import { WithSlot } from '~/types/game';

export function Tribes({
  data = null,
}: WithSlot): ReactNode {
  if (!data) return null;
  const { tribes = [] } = data;
  const shown = tribes.includes('ALL') ? ['ALL'] : tribes;
  return (
    <div className="card-tribes">
      {[...shown].reverse().map((tribe) => (
        <img
          alt={tribe}
          draggable={false}
          key={tribe}
          src={`/images/tribes/${tribe}.png`}
        />
      ))}
    </div>
  );
}

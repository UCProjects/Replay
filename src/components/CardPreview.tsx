import { Popper } from '@mui/material';
import { ReactNode } from 'react';
import { Card } from '~/components/Card';
import { useHoverTargets } from '~/hooks/useHoverTarget';
import { getCard } from '~/managers/cards';

export function CardPreview(): ReactNode {
  const targets = useHoverTargets('card');

  return targets.map(({ depth, element, value }) => {
    const card = getCard(Number(value));
    return card && (
      <Popper
        anchorEl={element}
        data-preview-depth={depth}
        key={depth}
        open
        placement="left"
        sx={(theme) => ({
          fontFamily: 'DTM-Mono',
          zIndex: theme.zIndex.tooltip + depth,
        })}
      >
        <Card data={card} full />
      </Popper>
    );
  });
}

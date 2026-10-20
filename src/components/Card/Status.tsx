import { ReactNode, useMemo } from 'react';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import { useGame } from '~/hooks/useGame';
import { useTranslation } from '~/hooks/useTranslation';
import { WithSlot } from '~/types/game';
import { statusIcons } from '~/utils/cardStatus';

export function Status({
  data = null,
}: WithSlot): ReactNode {
  const t = useTranslation();
  const game = useGame();
  const icons = useMemo(
    () => (data ? statusIcons(data, (id) => game.getUser(id)?.name) : [])
      .map((icon, i) => ({ ...icon, id: `${icon.image}-${i}` }))
      .reverse(),
    [data, game],
  );

  if (!data) return null;

  return (
    <div className="card-status">
      {icons.map(({
        args,
        counter,
        id,
        image,
        key,
      }) => (
        <Tip
          key={id}
          placement="top"
          title={(
            <Text
              html={t(key, ...args.map((arg) => (
                typeof arg === 'object' ? t(arg.macro) : `${arg}`
              )))}
            />
          )}
        >
          <span data-overlay={counter > 0 ? counter : undefined}>
            <img
              alt={image}
              draggable={false}
              src={`/images/powers/${image}.png`}
            />
          </span>
        </Tip>
      ))}
    </div>
  );
}

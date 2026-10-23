import { Box, Divider } from '@mui/material';
import { ReactNode } from 'react';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import { useTranslation } from '~/hooks/useTranslation';
import { Enchant } from '~/types/game';
import { toKebabCase } from '~/utils/cardStatus';

export type SlotEnchantProps = {
  enchant: Enchant;
};

const LAYER = {
  height: '100%',
  left: 0,
  objectFit: 'fill',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  width: '100%',
} as const;

export function SlotEnchant({
  enchant: {
    custom = 0,
    name,
  },
}: SlotEnchantProps): ReactNode {
  const t = useTranslation();
  const key = `enchant-${toKebabCase(name)}`;

  return (
    <>
      <Box
        alt=""
        className="enchant-background"
        component="img"
        src={`/images/enchants/backgrounds/${name}.png`}
        sx={{ ...LAYER, zIndex: 0 }}
      />
      <Box
        alt=""
        className="enchant-overlay"
        component="img"
        src={`/images/enchants/overlays/${name}.png`}
        sx={{ ...LAYER, zIndex: 6 }}
      />
      <Tip
        placement="top"
        title={(
          <Box>
            <Text fontWeight="bold" html={t(key, '1')} />
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', marginY: '4px' }} />
            <Text html={t(`${key}-desc`)} />
          </Box>
        )}
      >
        <Box
          alt={name}
          className="enchant-info"
          component="img"
          src="/images/powers/Enchant.png"
          sx={{
            cursor: 'help',
            height: 16,
            left: 5,
            position: 'absolute',
            top: 5,
            width: 16,
            zIndex: 7,
          }}
        />
      </Tip>
      {custom > 0 && (
        <Box
          className="enchant-custom"
          component="span"
          sx={{
            color: 'white',
            fontSize: 16,
            height: 16,
            left: 5,
            pointerEvents: 'none',
            position: 'absolute',
            textAlign: 'center',
            top: 25,
            width: 16,
            zIndex: 7,
          }}
        >
          {custom}
        </Box>
      )}
    </>
  );
}

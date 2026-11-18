import { Box, Divider, Popper } from '@mui/material';
import { ReactNode } from 'react';
import { Text } from '~/components/Text';
import { useHoverTargets } from '~/hooks/useHoverTarget';
import { useTranslation } from '~/hooks/useTranslation';

export function KeywordTip(): ReactNode {
  const t = useTranslation();
  const targets = useHoverTargets('kw');

  return targets.map(({ depth, element, value }) => {
    const description = t(`${value}-desc`);
    return description && (
      <Popper
        anchorEl={element}
        data-preview-depth={depth}
        key={depth}
        open
        placement="top"
        sx={(theme) => ({
          zIndex: theme.zIndex.tooltip + depth,
        })}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid #fff',
            maxWidth: 300,
            padding: '4px 8px',
            textAlign: 'left',
          }}
        >
          <Text fontWeight="bold" html={t(value)} />
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', marginY: '4px' }} />
          <Text html={description} />
        </Box>
      </Popper>
    );
  });
}

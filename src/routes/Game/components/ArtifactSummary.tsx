import {
  Box,
  Divider,
  IconButton,
  Popover,
  styled,
} from '@mui/material';
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { Badge } from '~/components/Badge';
import { Flex } from '~/components/Flex';
import { Text } from '~/components/Text';
import { useTranslation } from '~/hooks/useTranslation';
import { Artifact } from '~/types/game';
import { artifactCounter } from '~/utils/artifactCounter';

const Image = styled('img')({
  height: 20,
});

const ListImage = styled('img')({
  height: 28,
});

const VIEWPORT_MARGIN = 8;

export type ArtifactSummaryProps = {
  active?: boolean;
  artifacts: Artifact[];
  featured?: number;
  isOpponent?: boolean;
};

export function ArtifactSummary({
  active = false,
  artifacts,
  featured = undefined,
  isOpponent = false,
}: ArtifactSummaryProps): ReactNode {
  const t = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const handleOpen = useCallback(
    (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget),
    [],
  );
  const handleClose = useCallback(() => setAnchor(null), []);
  const toward = isOpponent ? 'bottom' : 'top';
  const away = isOpponent ? 'top' : 'bottom';
  const shown = artifacts.find(({ id }) => id === featured) ?? artifacts[0];
  const shownCounter = artifactCounter(shown);

  return (
    <>
      <IconButton
        aria-label={`${artifacts.length} artifacts`}
        className={active ? 'artifacts effectActive' : 'artifacts'}
        onClick={handleOpen}
        size="small"
        sx={{ padding: '2px' }}
      >
        <Badge
          anchorOrigin={{ horizontal: 'right', vertical: away }}
          badgeContent={artifacts.length}
          sx={{ margin: 0 }}
        >
          <Badge
            anchorOrigin={{ horizontal: 'right', vertical: toward }}
            badgeContent={shownCounter}
            invisible={shownCounter === undefined}
            sx={{ margin: 0 }}
          >
            <Image src={`/images/artifacts/${shown.image}.png`} />
          </Badge>
        </Badge>
      </IconButton>
      <Popover
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'center', vertical: toward }}
        marginThreshold={VIEWPORT_MARGIN}
        onClose={handleClose}
        open={Boolean(anchor)}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backgroundImage: 'none',
            border: '1px solid #fff',
            color: 'var(--font)',
            maxHeight: `calc(100vh - ${VIEWPORT_MARGIN * 2}px)`,
            maxWidth: `min(360px, calc(100vw - ${VIEWPORT_MARGIN * 2}px))`,
            padding: '8px',
          },
        }}
        transformOrigin={{ horizontal: 'center', vertical: away }}
      >
        {artifacts.map((art, index) => {
          const counter = artifactCounter(art);
          return (
            <Box key={art.id}>
              {index > 0 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', marginY: '6px' }} />}
              <Flex alignItems="flex-start" container wrap="nowrap">
                <Box sx={{
                  alignItems: 'center', display: 'flex', flexDirection: 'column', marginRight: '8px',
                }}
                >
                  <ListImage src={`/images/artifacts/${art.image}.png`} />
                  {counter !== undefined && (
                    <Text sx={{ fontSize: 12, fontWeight: 'bold' }}>{counter}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontWeight="bold" html={t(`artifact-name-${art.id}`)} />
                  <Text html={t(`artifact-${art.id}`)} />
                </Box>
              </Flex>
            </Box>
          );
        })}
      </Popover>
    </>
  );
}

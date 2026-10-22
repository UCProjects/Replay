import {
  Box,
  Divider,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ReactNode } from 'react';
import { Flex } from '~/components/Flex';
import { Text } from '~/components/Text';
import { useTranslation } from '~/hooks/useTranslation';
import { useFeaturedArtifact } from '~/hooks/useGame';
import { Artifact, Player } from '~/types/game';
import { ArtifactSummary } from './ArtifactSummary';
import { ProfileIcon } from './ProfileIcon';

const Image = styled('img')({
  height: 20,
});

export type ArtifactsProps = Pick<Player, 'artifacts' | 'isOpponent'> & {
  active?: boolean;
  playerId?: number;
};
type ArtProps = {
  art: Artifact;
  isOpponent: Player['isOpponent'];
};

function Art({
  art: {
    custom,
    id,
    image,
  },
  isOpponent,
}: ArtProps): ReactNode {
  const t = useTranslation();
  return (
    <ProfileIcon
      anchor={{ horizontal: 'right', vertical: isOpponent ? 'bottom' : 'top' }}
      badge={custom}
      props={{
        popper: {
          sx: {
            maxWidth: '500px',
          },
        },
      }}
      tip={(
        <Box>
          <Text html={t(`artifact-name-${id}`)} />
          <Divider />
          <Text html={t(`artifact-${id}`)} />
        </Box>
      )}
      tipAnchor="top"
    >
      <Image src={`/images/artifacts/${image}.png`} />
    </ProfileIcon>
  );
}

export function Artifacts({
  active = false,
  artifacts = [],
  isOpponent,
  playerId = 0,
}: ArtifactsProps): ReactNode {
  const theme = useTheme();
  const featured = useFeaturedArtifact(playerId);
  const compact = useMediaQuery(theme.breakpoints.down('sm'));
  if (compact && artifacts.length > 1) {
    return (
      <ArtifactSummary
        active={active}
        artifacts={artifacts}
        featured={featured}
        isOpponent={isOpponent}
      />
    );
  }
  return (
    <Flex className={active ? 'artifacts effectActive' : 'artifacts'}>
      {artifacts.map((art) => (
        <Art
          art={art}
          isOpponent={isOpponent}
          key={art.id}
        />
      ))}
    </Flex>
  );
}

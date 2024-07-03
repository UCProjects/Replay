import { Box, Divider, styled } from '@mui/material';
import { ReactNode } from 'react';
import { Flex } from '~/components/Flex';
import { Text } from '~/components/Text';
import { useTranslation } from '~/hooks/useTranslation';
import { Artifact, Player } from '~/types/game';
import { ProfileIcon } from './ProfileIcon';

const Image = styled('img')({
  height: 20,
});

export type ArtifactsProps = Pick<Player, 'artifacts' | 'isOpponent'>;
type ArtProps = {
  art: Artifact;
  isOpponent: Player['isOpponent'];
};

function Art({
  art: {
    custom,
    id,
    image,
    legendary,
  },
  isOpponent: _,
}: ArtProps): ReactNode {
  const t = useTranslation();
  return (
    <ProfileIcon
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
          <Text html={t(`{{ARTIFACT:${id}${legendary ? '|LEGEND' : ''}}}`)} />
          <Divider />
          <Text html={t(`{{ARTIFACT:${id}|desc}}`)} />
        </Box>
      )}
      tipAnchor="top"
    >
      <Image src={`/images/artifacts/${image}.png`} />
    </ProfileIcon>
  );
}

export function Artifacts({
  artifacts,
  isOpponent,
}: ArtifactsProps): ReactNode {
  return (
    <Flex>
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

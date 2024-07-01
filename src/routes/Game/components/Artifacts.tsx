import { Box, Divider, styled } from '@mui/material';
import { ReactNode } from 'react';
import Badge from '~/components/Badge';
import { Flex } from '~/components/Flex';
import { Text } from '~/components/Text';
import { Tip } from '~/components/Tip';
import { useTranslation } from '~/hooks/useTranslation';
import { Artifact, Player } from '~/types/game';

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
    custom, id, image,
  },
  isOpponent: _,
}: ArtProps): ReactNode {
  const t = useTranslation();
  return (
    <Badge
      badgeContent={custom}
      key={id}
    >
      <Tip
        placement="top"
        PopperProps={{
          sx: {
            maxWidth: '500px',
          },
        }}
        title={(
          <Box>
            <Text html={t(`{{ARTIFACT:${id}}}`)} />
            <Divider />
            <Text html={t(`{{ARTIFACT:${id}|desc}}`)} />
          </Box>
        )}
      >
        <Image
          src={`/images/artifacts/${image}.png`}
        />
      </Tip>
    </Badge>
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

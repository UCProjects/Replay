import { WorkspacePremium } from '@mui/icons-material';
import { Chip, ChipProps } from '@mui/material';
import { ReactNode } from 'react';

const PRO_COLOR = '#ffd54f';

export type ProBadgeProps = {
  onClick: () => void;
  size?: ChipProps['size'];
};

export default function ProBadge({ onClick, size }: ProBadgeProps): ReactNode {
  return (
    <Chip
      clickable
      icon={<WorkspacePremium />}
      label="Buy Pro"
      onClick={onClick}
      size={size}
      sx={{ borderColor: PRO_COLOR, color: PRO_COLOR, '& .MuiChip-icon': { color: PRO_COLOR } }}
      variant="outlined"
    />
  );
}

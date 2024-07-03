import { BadgeProps, TooltipProps } from '@mui/material';
import { ReactNode } from 'react';
import { Badge } from '~/components/Badge';
import { Tip } from '~/components/Tip';
import { useTranslation } from '~/hooks/useTranslation';

export type ProfileIconProps ={
  anchor?: BadgeProps['anchorOrigin'];
  badge: BadgeProps['badgeContent'];
  children: TooltipProps['children'];
  props?: {
    badge?: Omit<BadgeProps, 'anchorOrigin' | 'badgeContent' | 'children' | 'ref'>;
    popper?: TooltipProps['PopperProps'];
    tip?: Omit<TooltipProps, 'title' | 'PopperProps' | 'placement' | 'ref'>;
  };
  tip?: TooltipProps['title'];
  tipAnchor?: TooltipProps['placement'];
};

export function ProfileIcon({
  anchor,
  badge,
  children,
  props: {
    badge: badgeProps,
    popper,
    tip: tipProps,
  } = {},
  tip,
  tipAnchor = anchor?.vertical,
}: ProfileIconProps): ReactNode {
  const t = useTranslation();
  return (
    <Tip
      {...tipProps}
      placement={tipAnchor}
      PopperProps={popper}
      title={typeof tip === 'string' ? t(tip) : tip}
    >
      <Badge
        {...badgeProps}
        anchorOrigin={anchor}
        badgeContent={badge}
      >
        {children}
      </Badge>
    </Tip>
  );
}

import { GitHub, Google } from '@mui/icons-material';
import { Box } from '@mui/material';
import { ReactNode } from 'react';
import Discord from '~/assets/images/discord.svg';
import { LoginMethod } from '~/managers/identity';

export type LoginProvider = {
  icon: ReactNode;
  label: string;
  method: LoginMethod;
};

export const LOGIN_PROVIDERS: LoginProvider[] = [
  {
    icon: <Box alt="" component="img" src={Discord} sx={{ height: 20 }} />,
    label: 'Discord',
    method: 'discord',
  },
  { icon: <GitHub />, label: 'GitHub', method: 'github' },
  { icon: <Google />, label: 'Google', method: 'google' },
];

export const DIALOG_PAPER_PROPS = {
  sx: {
    backgroundColor: 'var(--bgcolor)',
    backgroundImage: 'none',
    border: '1px solid var(--border)',
    color: 'var(--font)',
  },
};

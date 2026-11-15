import { Box, Typography } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';
import {
  COOLDOWN_DAYS,
  FREE_FAVORITES,
  GRACE_DAYS,
  PRO_FAVORITES,
  RETENTION_DAYS,
} from '~/utils/favoriteRisk';
import { GUEST_DAYS, MEMBER_DAYS, PRO_DAYS } from '~/utils/searchWindow';

const LAST_UPDATED = 'November 14, 2026';

function days(count: number): string {
  return count === 1 ? '1 day' : `${count} days`;
}

type Item = string | { sub: string[]; text: string };

const KEPT: Item[] = [
  `Games (Replays) are kept for ${days(RETENTION_DAYS)} after they finish, then deleted.`,
  {
    sub: [
      `When the last person removes it, the game goes back to its ${days(RETENTION_DAYS)}, or ${days(GRACE_DAYS)} if it is already older than that.`,
    ],
    text: 'A favorited game is kept for as long as someone has it in their favorites.',
  },
  `After removing a favorite, you can't add that game back for ${days(COOLDOWN_DAYS)}.`,
];

const BROWSING: Item[] = [
  `Guests can browse games from the last ${days(GUEST_DAYS)}.`,
  `Signed in, you can browse the last ${days(MEMBER_DAYS)}.`,
  {
    sub: [`You can have ${FREE_FAVORITES} favorites.`],
    text: 'Signed in, you can still watch an older game by adding it to your favorites.',
  },
];

const PURCHASES: Item[] = [
  {
    sub: [
      `Browse games from the last ${days(PRO_DAYS)}.`,
      `Have up to ${PRO_FAVORITES} favorites.`,
      "If Pro runs out, you keep the favorites you have, but can't add more until you are under your limit.",
    ],
    text: 'Pro lets you:',
  },
  'Buy Pro, favorite slots and gift vouchers in the shop tab.',
  {
    sub: ['Sponsor with the same GitHub account you have linked here. Credits can take up to 6 hours to arrive.'],
    text: 'Purchases use FMC from your wallet, which comes from sponsoring on GitHub Sponsors.',
  },
  'Extra favorite slots can be bought, and they add to your limit with or without Pro.',
  "Pro and favorite slots don't keep a game longer than the rules above.",
  'Purchases are not refundable.',
];

const TERMS: Item[] = [
  'Replay is a community project, provided as is. It may be unavailable at times, and games can be removed at any time.',
  'Undercards games are public, and Replays will not be removed on request.',
  "Don't automate or abuse the site. Accounts that do can lose access.",
  {
    sub: ['Ask on Discord to have your data deleted. We delete your account and favorites, and your wallet if it is empty.'],
    text: 'We store your account ID, display name, linked sign-ins, favorites and purchases until you ask us to delete them.',
  },
  'Your browser keeps your sign-in, language, current tab and search, and copies of your favorited games. Nothing is used for tracking.',
];

const LIST_SX = {
  margin: 0, paddingLeft: 3, '& li': { marginBottom: 0.5 }, '& ul': { marginTop: 0.5 },
};

function Section({ children, title }: PropsWithChildren<{ title: string }>): ReactNode {
  return (
    <Box component="section" sx={{ marginBottom: 3 }}>
      <Typography component="h2" sx={{ marginBottom: 1 }} variant="h6">{title}</Typography>
      {children}
    </Box>
  );
}

function Items({ children, items }: PropsWithChildren<{ items: Item[] }>): ReactNode {
  return (
    <Box component="ul" sx={LIST_SX}>
      {items.map((item) => (typeof item === 'string' ? <li key={item}>{item}</li> : (
        <li key={item.text}>
          {item.text}
          <Items items={item.sub} />
        </li>
      )))}
      {children}
    </Box>
  );
}

export default function About(): ReactNode {
  return (
    <Box sx={{
      maxWidth: 720, padding: 2, textAlign: 'left', width: '100%',
    }}
    >
      <Section title="About">
        <Typography>
          Undercards Replay records every Undercards game so you can watch it again, turn by turn.
          A game can be missing if its recording failed.
        </Typography>
        <Typography sx={{ marginTop: 1, opacity: 0.7 }} variant="body2">
          {`Last updated ${LAST_UPDATED}`}
        </Typography>
      </Section>
      <Section title="How long Replays are kept">
        <Items items={KEPT} />
      </Section>
      <Section title="Browsing">
        <Items items={BROWSING} />
      </Section>
      <Section title="Accounts">
        <Items items={['Sign in with Discord, GitHub or Google.']}>
          <li>
            Link the ones you use from Linked accounts in the header, so they all open the same
            account. The same account works on
            {' '}
            <a href="https://uc.feildmaster.com/" rel="noreferrer" target="_blank">uc.feildmaster.com</a>
            .
          </li>
        </Items>
      </Section>
      <Section title="Pro and purchases">
        <Items items={PURCHASES}>
          <li>
            See your purchases and account history at
            {' '}
            <a href="https://wallet.feildmaster.com/" rel="noreferrer" target="_blank">wallet.feildmaster.com</a>
            .
          </li>
        </Items>
      </Section>
      <Section title="Terms">
        <Items items={TERMS} />
      </Section>
      <Section title="Contact">
        <Typography>
          Questions or problems? Ask on the
          {' '}
          <a href="https://discord.gg/B9sX8mT" rel="noreferrer" target="_blank">Discord server</a>
          .
        </Typography>
      </Section>
    </Box>
  );
}

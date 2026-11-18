import { EmojiEvents } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { DIALOG_PAPER_PROPS } from '~/components/loginProviders';
import { useGame } from '~/hooks/useGame';
import { useDisplayName } from '~/hooks/useDisplayName';
import { useProcessGameState } from '~/hooks/useProcessGameState';
import { useTranslation } from '~/hooks/useTranslation';
import { User } from '~/types/user';
import { PlayerSummary, summarize } from '~/utils/gameSummary';

export type ResultsProps = {
  onClose: () => void;
  onReplay: () => void;
  open: boolean;
};

const ROWS: [keyof PlayerSummary, string][] = [
  ['damageTaken', 'Damage taken'],
  ['healing', 'Healing'],
  ['monsters', 'Monsters played'],
  ['spells', 'Spells played'],
  ['monstersLost', 'Monsters lost'],
];

const CELL_SX = {
  borderColor: 'var(--border)',
  color: 'inherit',
  paddingX: 1,
};

function duration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor(ms / 1000) % 60;
  return `${minutes}:${`${seconds}`.padStart(2, '0')}`;
}

function PlayerName({ user, winner }: { user: User; winner: boolean }): ReactNode {
  const displayName = useDisplayName();
  return (
    <Box alignItems="center" component="span" display="inline-flex" gap={0.5}>
      {winner && <EmojiEvents fontSize="small" sx={{ color: '#ffd54f' }} />}
      <span className="user" data-soul={user.class}>{displayName(user.name)}</span>
    </Box>
  );
}

function Summary(): ReactNode {
  const t = useTranslation();
  const game = useGame();
  const processGameState = useProcessGameState(game);
  const [opponent, player] = game.users;
  const summary = useMemo(
    () => summarize(game.index.map(processGameState), [opponent.id, player.id]),
    [game, opponent.id, player.id, processGameState],
  );
  const columns = [player, opponent];
  const winnerId = game.results.winner?.id;
  const reason = t(game.results.type, { fallback: game.results.type });

  return (
    <>
      <Typography sx={{ opacity: 0.7 }} variant="body2">
        {`${reason} · ${summary.turns} turns · ${duration(summary.duration)}`}
      </Typography>
      <Table size="small" sx={{ marginTop: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={CELL_SX} />
            {columns.map((user) => (
              <TableCell align="center" key={user.id} sx={CELL_SX}>
                <PlayerName user={user} winner={user.id === winnerId} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {ROWS.map(([key, label]) => (
            <TableRow key={key}>
              <TableCell sx={CELL_SX}>{label}</TableCell>
              {columns.map((user) => (
                <TableCell align="center" key={user.id} sx={CELL_SX}>
                  {summary.players.get(user.id)?.[key] ?? 0}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default function Results({
  onClose,
  onReplay,
  open,
}: ResultsProps): ReactNode {
  const displayName = useDisplayName();
  const { results } = useGame();

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      open={open}
      PaperProps={DIALOG_PAPER_PROPS}
    >
      <DialogTitle>
        {results.winner ? `${displayName(results.winner.name)} won` : 'No winner'}
      </DialogTitle>
      <DialogContent>
        <Summary />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onReplay}>Watch again</Button>
        <Button color="inherit" onClick={onClose} variant="outlined">View board</Button>
      </DialogActions>
    </Dialog>
  );
}

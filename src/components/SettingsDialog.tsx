import {
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { ChangeEvent, ReactNode, useCallback } from 'react';
import { DIALOG_PAPER_PROPS } from '~/components/loginProviders';
import { useLocale, useSetLocale } from '~/hooks/useTranslation';
import { LANGUAGES } from '~/utils/languages';

const PAPER_PROPS = {
  sx: { ...DIALOG_PAPER_PROPS.sx, width: 320 },
};

export type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};

export function SettingsDialog({ onClose, open }: SettingsDialogProps): ReactNode {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const handleLanguage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setLocale(event.target.value),
    [setLocale],
  );

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      PaperProps={PAPER_PROPS}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Stack paddingTop={1} spacing={1}>
          <TextField
            helperText="Card names and game text. The rest of the site stays in English."
            label="Game language"
            onChange={handleLanguage}
            select
            size="small"
            sx={{ textAlign: 'left' }}
            value={LANGUAGES.some(({ code }) => code === locale) ? locale : 'en'}
          >
            {LANGUAGES.map(({ code, name }) => (
              <MenuItem key={code} value={code}>{name}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

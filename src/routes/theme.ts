import { createTheme } from '@mui/material';

export default createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
        color: 'inherit', // WHY!?!?!
      },
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#000',
      paper: '#000',
    },
    primary: {
      main: '#000',
    },
    secondary: {
      main: '#000',
    },
  },
  typography: {
  },
});

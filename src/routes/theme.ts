import { createTheme } from '@mui/material';

export default createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1000,
      xl: 1200,
    },
  },
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

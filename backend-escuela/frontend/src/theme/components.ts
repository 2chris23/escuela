import { ThemeOptions } from '@mui/material';

export const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      },
      main: {
        flex: 1,
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: 16,
        color: '#6B7280',
      },
      shrink: {
        fontWeight: 600,
        fontSize: 20,
        color: '#1D3048',
      },
    },
  },
}; 
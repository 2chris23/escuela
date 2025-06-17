import { alpha } from '@mui/material';

import { burntSienna, caribbeanGreen, downy, ebonyClay, orange, watermelon } from './colors';

const white = '#FFFFFF';
const black = '#000000';

const common = {
  black,
  white,
};

const grey = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

const success = {
  light: '#34D399',
  main: '#059669',
  dark: '#047857',
  contrastText: white,
};

const info = {
  light: '#60A5FA',
  main: '#3B82F6',
  dark: '#2563EB',
  contrastText: white,
};

const warning = {
  light: '#FCD34D',
  main: '#F59E0B',
  dark: '#D97706',
  contrastText: white,
};

const error = {
  light: '#F87171',
  main: '#EF4444',
  dark: '#DC2626',
  contrastText: white,
};

export const base = {
  common,
  grey,
  success,
  info,
  warning,
  error,
};

export const light = {
  primary: caribbeanGreen,
  secondary: downy,
  tertiary: watermelon,
  burntSienna,
  orange,
  text: {
    primary: ebonyClay[900],
    secondary: ebonyClay[600],
    disabled: ebonyClay[400],
  },
  divider: ebonyClay[200],
  background: {
    paper: white,
    default: grey[50],
  },
  action: {
    active: grey[500],
    hover: alpha(grey[500], 0.08),
    selected: alpha(grey[500], 0.16),
    disabled: alpha(grey[500], 0.38),
    disabledBackground: alpha(grey[500], 0.12),
    focus: alpha(grey[500], 0.16),
  },
};

export const dark = {
  primary: caribbeanGreen,
  secondary: downy,
  tertiary: watermelon,
  burntSienna,
  orange,
  text: {
    primary: white,
    secondary: ebonyClay[50],
    disabled: ebonyClay[200],
  },
  divider: ebonyClay[700],
  background: {
    paper: ebonyClay[800],
    default: ebonyClay[900],
  },
  action: {
    active: ebonyClay[50],
    hover: alpha(ebonyClay[50], 0.08),
    selected: alpha(ebonyClay[50], 0.16),
    disabled: alpha(ebonyClay[50], 0.38),
    disabledBackground: alpha(ebonyClay[50], 0.12),
    focus: alpha(ebonyClay[50], 0.16),
  },
}; 
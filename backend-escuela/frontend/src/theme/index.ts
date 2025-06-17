import { createTheme } from '@mui/material';
import merge from 'lodash.merge';

import { components } from './components';
import { base, dark, light } from './palette';
import { typography } from './typography';
import { shadows } from './shadows';

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1440,
  },
};

export const themes = {
  light: createTheme(
    merge(
      {
        breakpoints,
        palette: { ...base, ...light },
        typography,
        shadows,
      },
      components
    )
  ),
  dark: createTheme(
    merge(
      {
        breakpoints,
        palette: { ...base, ...dark },
        typography,
        shadows,
      },
      components
    )
  ),
}; 
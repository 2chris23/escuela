import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import scrollbar from '../styles/scrollbar';
import echart from '../styles/echart';
import 'simplebar-react/dist/simplebar.min.css';
import simplebar from '../styles/simplebar';

const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme: Theme) => ({
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      ...scrollbar(theme),
    },
    ...echart(),
    ...simplebar(theme),
  }),
};

export default CssBaseline; 
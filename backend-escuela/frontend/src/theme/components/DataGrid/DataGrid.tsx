import { Theme } from '@mui/material';

import type { DataGridComponents } from '@mui/x-data-grid/themeAugmentation';
import pxToRem from '../../functions/px-to-rem';

const DataGrid: DataGridComponents<Omit<Theme, 'components'>>['MuiDataGrid'] = {
  defaultProps: {
    disableRowSelectionOnClick: true,
    disableColumnMenu: true,
    pagination: true,
    density: 'comfortable',
    scrollbarSize: 1,
  },
  styleOverrides: {
    root: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderColor: theme.palette.divider,
      '--DataGrid-rowBorderColor': theme.palette.background.paper,
      '--DataGrid-containerBackground': theme.palette.background.paper,
      borderBottomLeftRadius: theme.spacing(2.5),
      borderBottomRightRadius: theme.spacing(2.5),
      '& .MuiDataGrid-filler': {
        flex: 0,
      },
      '& .MuiDataGrid-scrollbar--vertical': {
        display: 'none',
      },
    }),
    main: ({ theme }: { theme: Theme }) => ({
      marginLeft: theme.spacing(2.5),
      marginRight: theme.spacing(2.5),
    }),
    'container--top': ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.background.paper,
      '::after': {
        content: 'none',
      },
    }),
    columnHeaders: ({ theme }: { theme: Theme }) => ({
      borderBottom: 'none',
      backgroundColor: theme.palette.background.paper,
    }),
    columnHeader: () => ({
      '&:focus': {
        outline: 'none',
      },
      '&:focus-within': {
        outline: 'none',
      },
    }),
    columnHeaderTitle: ({ theme }: { theme: Theme }) => ({
      fontSize: theme.typography.subtitle1.fontSize,
      fontWeight: theme.typography.subtitle1.fontWeight,
    }),
    columnHeaderTitleContainer: () => ({
      gap: 8,
    }),
    columnSeparator: () => ({
      display: 'none',
    }),
    cell: ({ theme }: { theme: Theme }) => ({
      color: theme.palette.text.secondary,
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.body1.fontWeight,
      fontFamily: theme.typography.body1.fontFamily,
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      '&:focus': {
        outline: 'none',
      },
      '&:focus-within': {
        outline: 'none',
      },
    }),
    row: ({ theme }: { theme: Theme }) => ({
      border: 'none',
      width: '100%',
      '&:hover': {
        backgroundColor: theme.palette.background.default,
      },
    }),
    virtualScroller: () => ({
      overflowX: 'scroll !important' as 'scroll',
      display: 'flex',
      flexDirection: 'column',
      height: pxToRem(432),
    }),
    virtualScrollerContent: () => ({
      width: 'auto',
    }),
    virtualScrollerRenderZone: () => ({
      width: 'auto',
      position: 'static',
      height: '100%',
    }),
    filler: () => ({
      display: 'none',
      height: '0 !important',
      flex: 0,
      flexGrow: 0,
    }),
    withBorderColor: ({ theme }: { theme: Theme }) => ({
      borderColor: theme.palette.divider,
    }),
    footerContainer: ({ theme }: { theme: Theme }) => ({
      borderBottomLeftRadius: theme.spacing(2.5),
      borderBottomRightRadius: theme.spacing(2.5),
    }),
    cellEmpty: ({ theme }: { theme: Theme }) => ({
      width: theme.spacing(0),
      maxWidth: theme.spacing(0),
    }),
    sortIcon: () => ({
      color: 'initial',
      width: 20,
    }),
    overlay: ({ theme }: { theme: Theme }) => ({
      backgroundColor: theme.palette.background.paper,
      fontSize: theme.typography.subtitle1.fontSize,
      fontWeight: theme.typography.subtitle1.fontWeight,
      fontFamily: theme.typography.body1.fontFamily,
    }),
    overlayWrapperInner: () => ({
      height: '100%',
    }),
  },
};

export default DataGrid; 
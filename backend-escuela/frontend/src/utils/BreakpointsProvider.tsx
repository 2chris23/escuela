import { useMediaQuery, useTheme } from '@mui/material';
import { createContext, ReactNode, useContext } from 'react';

interface BreakpointsContextType {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
}

const BreakpointsContext = createContext<BreakpointsContextType | undefined>(undefined);

interface BreakpointsProviderProps {
  children: ReactNode;
}

const BreakpointsProvider = ({ children }: BreakpointsProviderProps) => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  const value = {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
  };

  return <BreakpointsContext.Provider value={value}>{children}</BreakpointsContext.Provider>;
};

export const useBreakpoints = () => {
  const context = useContext(BreakpointsContext);
  if (context === undefined) {
    throw new Error('useBreakpoints must be used within a BreakpointsProvider');
  }
  return context;
};

export default BreakpointsProvider; 
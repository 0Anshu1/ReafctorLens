import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  mode: PaletteMode;
  toggleMode: () => void;
}

const Ctx = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
};

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    const stored = localStorage.getItem('refactorlens-theme');
    if (stored === 'light' || stored === 'dark') setMode(stored);
  }, []);

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('refactorlens-theme', next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme({
    palette: { mode,
      primary: { main: mode === 'light' ? '#1976d2' : '#90caf9' },
      secondary: { main: mode === 'light' ? '#dc004e' : '#f48fb1' },
      background: { default: mode === 'light' ? '#f5f5f5' : '#121212' }
    },
    shape: { borderRadius: 8 },
    components: {
      MuiPaper: { styleOverrides: { root: { transition: 'background-color .2s ease' } } },
      MuiAppBar: { styleOverrides: { root: { transition: 'background-color .2s ease' } } },
    }
  }), [mode]);

  return (
    <Ctx.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Ctx.Provider>
  );
};



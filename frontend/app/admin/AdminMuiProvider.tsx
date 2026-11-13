'use client';

import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from '../../components/ThemeProvider';

export function AdminMuiProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const muiTheme = useMemo(() => {
    const isDark = theme === 'dark';
    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#0284c7', // Light Cerulean Blue
          light: '#38bdf8',
          dark: '#0c4a6e',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#d97706', // Gold / Amber
          light: '#fbbf24',
          dark: '#b45309',
        },
        background: {
          default: isDark ? '#071018' : '#f8fafc',
          paper: isDark ? '#0c1a29' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f0f8ff' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
      },
      typography: {
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        h5: {
          fontWeight: 700,
        },
        h6: {
          fontWeight: 700,
        },
        subtitle1: {
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 8,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: isDark
                ? '0 4px 20px rgba(0,0,0,0.5)'
                : '0 4px 20px rgba(6,78,59,0.06)',
            },
          },
        },
      },
    });
  }, [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

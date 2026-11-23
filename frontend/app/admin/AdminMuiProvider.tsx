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
          main: '#3988CA', // Brand Cerulean Blue
          light: '#60a5fa',
          dark: '#1e40af',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#18334F', // Deep Navy Brand
          light: '#2d5377',
          dark: '#0d1d2d',
        },
        background: {
          default: isDark ? '#0b1320' : '#f8fafc',
          paper: isDark ? '#111d30' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f1f5f9' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
        divider: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
      },
      typography: {
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        h5: {
          fontWeight: 800,
          letterSpacing: '-0.02em',
        },
        h6: {
          fontWeight: 700,
          letterSpacing: '-0.01em',
        },
        subtitle1: {
          fontWeight: 600,
        },
        subtitle2: {
          fontWeight: 600,
        },
        body2: {
          lineHeight: 1.5,
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
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              boxShadow: isDark
                ? '0 1px 3px 0 rgba(0, 0, 0, 0.4)'
                : '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
            },
            head: {
              backgroundColor: isDark ? '#142238' : '#f8fafc',
              color: isDark ? '#cbd5e1' : '#475569',
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              backgroundImage: 'none',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDark ? 'rgba(255,255,255,0.14)' : '#CBD5E1',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3988CA',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3988CA',
                borderWidth: '2px',
              },
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

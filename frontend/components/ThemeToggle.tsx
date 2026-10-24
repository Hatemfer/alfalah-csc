'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem',
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-surface-alt)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {theme === 'light' ? (
        <Moon size={18} aria-hidden="true" />
      ) : (
        <Sun size={18} aria-hidden="true" style={{ color: 'var(--color-accent-400)' }} />
      )}
    </button>
  );
}

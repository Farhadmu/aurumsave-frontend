'use client';

import React from 'react';
import { useTheme } from '../../lib/theme-context';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-aurum-surface border border-aurum-border hover:border-aurum-gold/40 text-aurum-text transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-aurum-gold ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-aurum-gold group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-aurum-gold group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}

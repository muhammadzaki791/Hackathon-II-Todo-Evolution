/**
 * Theme Context using next-themes
 * Feature 007: UI/UX Enhancement & Theme System
 * User Story 2: Theme Switching (Priority: P1)
 *
 * Implements light/dark theme system using next-themes library for professional theme management.
 * Provides theme state and toggle functionality across the application.
 *
 * Constitution Compliance:
 * - FR-009: Supports both light and dark color themes
 * - FR-010: Uses CSS variables for global color system
 * - FR-011: Provides theme toggle button accessible from all pages
 * - FR-012: Persists user theme preference in localStorage
 * - FR-015: Theme preference preserved across browser sessions
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from 'next-themes';

// Define theme type
export type Theme = 'light' | 'dark';

// Define context type
interface ThemeContextType {
  theme: Theme | undefined;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      theme: theme as Theme | undefined,
      setTheme: (newTheme: Theme) => setTheme(newTheme),
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
}
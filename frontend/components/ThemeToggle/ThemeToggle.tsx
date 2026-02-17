/**
 * ThemeToggle Component
 * Feature 007: UI/UX Enhancement & Theme System
 * User Story 2: Theme Switching (Priority: P1)
 *
 * Provides a button to toggle between light and dark themes.
 * Uses next-themes for professional theme management with system preference support.
 *
 * Constitution Compliance:
 * - FR-011: Provides theme toggle button accessible from all pages
 * - FR-012: Persists user theme preference in localStorage
 * - FR-015: Theme preference preserved across browser sessions
 */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

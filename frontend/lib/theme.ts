/**
 * Theme Utilities for UI/UX Enhancement Feature (007)
 *
 * Provides theme-related utilities and constants for consistent styling
 *
 * Feature Requirements Implemented:
 * - FR-010: Global color system using CSS variables
 * - FR-013: Consistent colors across UI elements in both themes
 * - FR-026: Priority levels with distinct visual indicators
 * - FR-027: Tag display as labeled chips/badges
 */

import { TaskPriority } from '@/types/Theme';

// Priority color mappings for consistent visual indicators (FR-026)
export const PRIORITY_COLORS = {
  high: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-400',
  },
  medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-700',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  low: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
  },
} as const;

// Get color classes for a priority level
export function getPriorityColorClasses(priority: TaskPriority) {
  return PRIORITY_COLORS[priority];
}

// Tag color mappings for consistent visual indicators (FR-027)
export const TAG_COLORS = {
  default: {
    bg: 'bg-gray-100 dark:bg-gray-700',
    text: 'text-gray-800 dark:text-gray-200',
    border: 'border-gray-200 dark:border-gray-600',
  },
} as const;

// Get tag color classes
export function getTagColorClasses() {
  return TAG_COLORS.default;
}

// Theme-related utility functions
export function isValidTheme(theme: string): theme is 'light' | 'dark' {
  return theme === 'light' || theme === 'dark';
}

export function getSystemThemePreference(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}
/**
 * Theme Type Definitions for UI/UX Enhancement Feature (007)
 *
 * Defines types for theme system including priority and theme-related types
 *
 * Feature Requirements Implemented:
 * - FR-009: Support both light and dark color themes
 * - FR-020: Use consistent status colors for task states and priorities
 * - FR-028: Priority levels displayed with distinct visual indicators (high=red, medium=yellow, low=blue)
 */

export type Theme = 'light' | 'dark';

export type TaskPriority = 'high' | 'medium' | 'low';

export interface ThemeColors {
  primary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  success?: string;
  warning?: string;
  error?: string;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}
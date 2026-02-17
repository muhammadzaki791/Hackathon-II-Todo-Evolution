/**
 * Utility Functions
 * Shared utility functions across the frontend application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with tailwind-merge for consistent styling
 *
 * Usage:
 * ```tsx
 * <div className={cn('bg-red-500', condition && 'bg-blue-500')} />
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
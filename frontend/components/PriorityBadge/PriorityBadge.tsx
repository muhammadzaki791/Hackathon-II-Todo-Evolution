/**
 * PriorityBadge Component
 * Feature 007: UI/UX Enhancement & Theme System
 * User Story 2: Task Priority Management (Priority: P1)
 *
 * Displays task priority as a colored badge with distinct visual indicators.
 * - High priority: Red badge with "High" text
 * - Medium priority: Yellow badge with "Medium" text
 * - Low priority: Blue badge with "Low" text
 *
 * Constitution Compliance:
 * - FR-028: Priority levels displayed with distinct visual indicators (high=red, medium=yellow, low=blue)
 */

'use client';

import { TaskPriority } from '@/types/Theme';

interface PriorityBadgeProps {
  /** Task priority level */
  priority: TaskPriority;

  /** Additional CSS classes */
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const priorityConfig = {
    high: {
      label: 'High',
      bgClass: 'bg-red-100/70 dark:bg-red-500/20',
      textClass: 'text-red-700 dark:text-red-300',
      borderClass: 'border-red-200/50 dark:border-red-500/30',
      dotClass: 'bg-red-600 dark:bg-red-400',
    },
    medium: {
      label: 'Medium',
      bgClass: 'bg-amber-100/70 dark:bg-amber-500/20',
      textClass: 'text-amber-700 dark:text-amber-300',
      borderClass: 'border-amber-200/50 dark:border-amber-500/30',
      dotClass: 'bg-amber-600 dark:bg-amber-400',
    },
    low: {
      label: 'Low',
      bgClass: 'bg-blue-100/70 dark:bg-blue-500/20',
      textClass: 'text-blue-700 dark:text-blue-300',
      borderClass: 'border-blue-200/50 dark:border-blue-500/30',
      dotClass: 'bg-blue-600 dark:bg-blue-400',
    },
  };

  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}

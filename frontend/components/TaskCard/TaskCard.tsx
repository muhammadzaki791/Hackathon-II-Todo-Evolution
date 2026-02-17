/**
 * TaskCard Component
 * User Story 2: Manage Tasks on Dashboard
 *
 * Displays individual task with completion toggle and delete functionality.
 *
 * Feature 006: Task Organization & Usability Enhancements
 * - Displays priority badge (US2 - FR-026)
 * - Displays tag chips (US4 - FR-027)
 *
 * Constitution Compliance:
 * - FR-008: Toggle task completion status
 * - FR-010: Delete tasks
 * - FR-011: Display visual indicators for task status
 * - FR-020: Consistent Tailwind CSS styling
 * - FR-026: Display priority with distinct visual indicators
 * - FR-027: Display tags as labeled chips/badges
 */

'use client';

import { Task } from '@/types/Task';
import { PriorityBadge } from '../PriorityBadge/PriorityBadge';
import { TagChip } from '../TagChip/TagChip';

interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit }: TaskCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-border">
      {/* Priority and Status Badges - FR-011, FR-026 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
            task.completed
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
          {task.completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      {/* Task Content */}
      <div className="mb-4 flex-1">
        <h3
          className={`text-base font-semibold leading-tight transition-all ${
            task.completed
              ? 'text-muted-foreground line-through'
              : 'text-foreground'
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Tags - FR-027 */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {task.tags.map(tag => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Timestamps */}
      <div className="mb-4 space-y-0.5 text-xs text-muted-foreground">
        <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
        {task.updated_at !== task.created_at && (
          <p>Updated: {new Date(task.updated_at).toLocaleDateString()}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Toggle Completion Button - FR-008 */}
        <button
          onClick={onToggle}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
            task.completed
              ? 'bg-muted text-muted-foreground hover:bg-muted hover:opacity-80 dark:bg-muted dark:text-muted-foreground'
              : 'bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-sm'
          }`}
          title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        {/* Edit Button - FR-009 (future implementation) */}
        <button
          onClick={onEdit}
          className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-all duration-150 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30"
          title="Edit task"
        >
          Edit
        </button>

        {/* Delete Button - FR-010 */}
        <button
          onClick={onDelete}
          className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-all duration-150 hover:bg-destructive/20 dark:bg-destructive/20 dark:text-destructive dark:hover:bg-destructive/30"
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

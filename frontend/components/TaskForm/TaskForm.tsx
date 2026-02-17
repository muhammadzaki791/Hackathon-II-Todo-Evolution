/**
 * TaskForm Component
 * User Story 2: Manage Tasks on Dashboard
 *
 * Form for creating and updating tasks.
 * Supports both create mode and edit mode with partial updates.
 *
 * Constitution Compliance:
 * - FR-007: Create new tasks with title and optional description
 * - FR-009: Update existing task details
 * - FR-017: Loading states during operations
 * - FR-018: Preserve user input during errors
 * - FR-020: Consistent Tailwind CSS styling
 */

'use client';

import React from "react"

import { useState, FormEvent, useEffect } from 'react';
import { Task, TaskCreate, TaskUpdate, TaskPriority } from '@/types/Task';
import { api } from '@/lib/api';
import { TagChip } from '../TagChip/TagChip';

interface TaskFormProps {
  /** User ID for API calls */
  userId: string;

  /** Existing task for edit mode (null/undefined for create mode) */
  task?: Task | null;

  /** Callback when task is successfully created/updated */
  onSuccess: () => void;

  /** Callback when form is cancelled */
  onCancel: () => void;
}

export function TaskForm({ userId, task, onSuccess, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!task;

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setTags(task.tags);
    }
  }, [task]);

  // Add tag handler
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 20) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Remove tag handler
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Handle Enter key in tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  /**
   * Handle form submission
   * FR-007: Create new task
   * FR-009: Update existing task
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    if (description && description.length > 1000) {
      setError('Description must be 1000 characters or less');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // FR-009: Update existing task
        const updateData: TaskUpdate = {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          tags,
        };
        await api.updateTask(userId, task.id, updateData);
      } else {
        // FR-007: Create new task
        const createData: TaskCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          tags,
        };
        await api.createTask(userId, createData);
      }

      // Success callback (refresh tasks, close form)
      onSuccess();

      // Reset form if in create mode
      if (!isEditMode) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setTags([]);
      }
    } catch (err) {
      // FR-016: Handle API errors gracefully
      const message = err instanceof Error ? err.message : 'Operation failed';
      setError(message);

      // FR-018: Preserve input on error (don't clear fields)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm dark:border-border">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Display - FR-016 */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Title Field - FR-007 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            placeholder="Enter task title"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {title.length}/200 characters
          </p>
        </div>

        {/* Description Field - FR-007 */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={3}
            className="block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
            placeholder="Enter task description"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {description.length}/1000 characters
          </p>
        </div>

        {/* Priority Dropdown - Feature 006: US2 - FR-028 */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="block w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Tag Input - Feature 006: US4 - FR-029 */}
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Tags (optional)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              maxLength={50}
              className="block flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              placeholder="Type tag and press Enter"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 20}
              className="rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {tags.length}/20 tags
          </p>

          {/* Tag Display */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <TagChip key={tag} tag={tag} removable onRemove={handleRemoveTag} />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEditMode ? 'Update Task' : 'Create Task'
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

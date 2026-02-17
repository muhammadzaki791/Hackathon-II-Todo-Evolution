/**
 * useTasks Hook
 * Custom React hook for task data management
 *
 * Provides CRUD operations for tasks with automatic JWT token handling
 * and optimistic UI updates for better user experience.
 *
 * Feature 006: Task Organization & Usability Enhancements
 * - Added query parameters for search, filtering, and sorting
 *
 * Constitution Compliance:
 * - FR-012: Persists task changes to backend API automatically
 * - FR-013: JWT tokens automatically attached via api client
 * - FR-016: Handles API errors gracefully
 * - FR-017: Provides loading states during operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, TaskQueryParams } from '@/lib/api';
import { Task, TaskCreate, TaskUpdate } from '@/types/Task';

interface UseTasksReturn {
  /** Array of user's tasks */
  tasks: Task[];

  /** Loading state during API operations */
  isLoading: boolean;

  /** Error message from API operations */
  error: string | null;

  /** Refresh tasks from API */
  refreshTasks: () => Promise<void>;

  /** Create a new task */
  createTask: (data: TaskCreate) => Promise<Task>;

  /** Update an existing task */
  updateTask: (taskId: number, data: TaskUpdate) => Promise<Task>;

  /** Delete a task */
  deleteTask: (taskId: number) => Promise<void>;

  /** Toggle task completion status */
  toggleTaskCompletion: (taskId: number) => Promise<Task>;
}

/**
 * Custom hook for task data management
 *
 * Feature 006: Now accepts query parameters for search, filtering, and sorting
 *
 * Usage:
 * ```typescript
 * const { tasks, isLoading, error, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks(userId, {
 *   search: 'meeting',
 *   priority: 'high',
 *   sort: 'priority'
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 *
 * return <TaskList tasks={tasks} onToggle={toggleTaskCompletion} />;
 * ```
 *
 * @param userId - The authenticated user's ID
 * @param queryParams - Optional query parameters for filtering, searching, and sorting
 */
export function useTasks(userId: string, queryParams?: TaskQueryParams): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch tasks from API with query parameters
   * Feature 006: FR-008 to FR-035 (search, filter, sort)
   */
  const refreshTasks = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const fetchedTasks = await api.getTasks(userId, queryParams);
      setTasks(fetchedTasks);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, queryParams]);

  // Load tasks on mount and when userId or queryParams change
  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  /**
   * Create a new task
   * FR-007: Allow users to create new tasks with title and optional description
   * FR-012: Persist task changes to backend API automatically
   */
  const createTask = useCallback(async (data: TaskCreate): Promise<Task> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    setError(null);

    try {
      const newTask = await api.createTask(userId, data);

      // Optimistic update: add to local state immediately
      setTasks(prevTasks => [...prevTasks, newTask]);

      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      throw err;
    }
  }, [userId]);

  /**
   * Update an existing task
   * FR-009: Allow users to update existing task details
   * FR-012: Persist task changes to backend API automatically
   */
  const updateTask = useCallback(async (taskId: number, data: TaskUpdate): Promise<Task> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    setError(null);

    try {
      const updatedTask = await api.updateTask(userId, taskId, data);

      // Optimistic update: update in local state immediately
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );

      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    }
  }, [userId]);

  /**
   * Delete a task
   * FR-010: Allow users to delete tasks from their task list
   * FR-012: Persist task changes to backend API automatically
   */
  const deleteTask = useCallback(async (taskId: number): Promise<void> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    setError(null);

    try {
      await api.deleteTask(userId, taskId);

      // Optimistic update: remove from local state immediately
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      throw err;
    }
  }, [userId]);

  /**
   * Toggle task completion status
   * FR-008: Allow users to toggle task completion status (complete/incomplete)
   * FR-012: Persist task changes to backend API automatically
   */
  const toggleTaskCompletion = useCallback(async (taskId: number): Promise<Task> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    setError(null);

    try {
      const updatedTask = await api.toggleTaskCompletion(userId, taskId);

      // Optimistic update: update in local state immediately
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? updatedTask : task))
      );

      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task completion';
      setError(message);
      throw err;
    }
  }, [userId]);

  return {
    tasks,
    isLoading,
    error,
    refreshTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
}

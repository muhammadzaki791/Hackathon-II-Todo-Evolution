'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { TaskCard } from '@/components/TaskCard/TaskCard';
import { TaskForm } from '@/components/TaskForm/TaskForm';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { SortSelector, SortOrder } from '@/components/SortSelector/SortSelector';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { Task } from '@/types/Task';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { session, logout } = useAuth();
  const userId = session?.user?.id || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('date');

  const queryParams = useMemo(() => ({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    tags: tagFilter || undefined,
    sort: sortOrder,
  }), [searchQuery, statusFilter, priorityFilter, tagFilter, sortOrder]);

  const { tasks, isLoading, error, refreshTasks, deleteTask, toggleTaskCompletion } = useTasks(userId, queryParams);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  if (!session) {
    return null;
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    refreshTasks();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setTagFilter(null);
    setSortOrder('date');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                My Tasks
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome, <span className="font-medium">{session.user.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Action Bar */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <button
            onClick={() => {
              setEditingTask(null);
              setShowForm(!showForm);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
          >
            {showForm && !editingTask ? 'Cancel' : '+ Add Task'}
          </button>
          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || tagFilter) && (
            <button
              onClick={handleClearFilters}
              className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="mb-8">
            <TaskForm
              userId={userId}
              task={editingTask}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tasks by title or description..."
          />
        </div>

        {/* Filter and Sort Controls */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterPanel
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            tagFilter={tagFilter}
            availableTags={availableTags}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onTagChange={setTagFilter}
            onClearFilters={handleClearFilters}
          />
          <SortSelector value={sortOrder} onChange={setSortOrder} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              <p className="text-sm font-medium text-muted-foreground">Loading your tasks...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || tagFilter
                ? 'No tasks found'
                : 'No tasks yet'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || tagFilter
                ? 'Try adjusting your search or filters to find what you are looking for.'
                : 'Create your first task to get started with better task management.'}
            </p>
          </div>
        )}

        {/* Task Grid */}
        {!isLoading && tasks.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTaskCompletion(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={() => handleEdit(task)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

'use client';

interface FilterPanelProps {
  statusFilter: 'all' | 'pending' | 'completed';
  priorityFilter: 'all' | 'high' | 'medium' | 'low';
  tagFilter: string | null;
  availableTags: string[];
  onStatusChange: (status: 'all' | 'pending' | 'completed') => void;
  onPriorityChange: (priority: 'all' | 'high' | 'medium' | 'low') => void;
  onTagChange: (tag: string | null) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  statusFilter,
  priorityFilter,
  tagFilter,
  availableTags,
  onStatusChange,
  onPriorityChange,
  onTagChange,
  onClearFilters
}: FilterPanelProps) {
  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all' || tagFilter !== null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Filters:</span>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as 'all' | 'pending' | 'completed')}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value as 'all' | 'high' | 'medium' | 'low')}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
        <option value="all">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      <select
        value={tagFilter || ''}
        onChange={(e) => onTagChange(e.target.value || null)}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        disabled={availableTags.length === 0}
      >
        <option value="">All Tags</option>
        {availableTags.map(tag => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

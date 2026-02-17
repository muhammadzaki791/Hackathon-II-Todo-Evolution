'use client';

export type SortOrder = 'date' | 'alpha' | 'priority';

interface SortSelectorProps {
  value: SortOrder;
  onChange: (sort: SortOrder) => void;
  className?: string;
}

export function SortSelector({ value, onChange, className = '' }: SortSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="sort-select" className="text-sm font-medium text-muted-foreground">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOrder)}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
      >
        <option value="date">Date (Newest First)</option>
        <option value="alpha">Alphabetical (A-Z)</option>
        <option value="priority">Priority (High to Low)</option>
      </select>
    </div>
  );
}

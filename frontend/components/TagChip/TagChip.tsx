'use client';

interface TagChipProps {
  tag: string;
  removable?: boolean;
  onRemove?: (tag: string) => void;
  className?: string;
}

export function TagChip({ tag, removable = false, onRemove, className = '' }: TagChipProps) {
  const handleRemove = () => {
    if (onRemove) {
      onRemove(tag);
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ${className}`}
    >
      {tag}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20 focus:outline-none transition-colors"
          aria-label={`Remove tag ${tag}`}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

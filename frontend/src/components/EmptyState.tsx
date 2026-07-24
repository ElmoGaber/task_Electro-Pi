interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="card empty-state">
      <svg
        className="empty-icon"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="12" y="20" width="56" height="48" rx="6" fill="#E5E7EB" />
        <rect x="20" y="30" width="30" height="4" rx="2" fill="#9CA3AF" />
        <rect x="20" y="40" width="40" height="4" rx="2" fill="#9CA3AF" />
        <rect x="20" y="50" width="22" height="4" rx="2" fill="#9CA3AF" />
        <circle cx="60" cy="56" r="16" fill="#DBEAFE" />
        <path d="M60 48v16M52 56h16" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <h3>{hasFilters ? 'No matching tasks' : 'No tasks yet'}</h3>
      <p>
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Create your first task to get started.'}
      </p>
      {hasFilters && (
        <button className="button button-secondary" type="button" onClick={onClearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  )
}

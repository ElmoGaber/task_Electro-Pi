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
        {hasFilters ? (
          <>
            <circle cx="36" cy="36" r="22" stroke="#9CA3AF" strokeWidth="3" />
            <path d="M52 52l12 12" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
            <rect x="24" y="28" width="24" height="3" rx="1.5" fill="#D1D5DB" />
            <rect x="24" y="36" width="16" height="3" rx="1.5" fill="#D1D5DB" />
          </>
        ) : (
          <>
            <rect x="12" y="20" width="56" height="48" rx="6" fill="#E5E7EB" />
            <rect x="20" y="30" width="30" height="4" rx="2" fill="#9CA3AF" />
            <rect x="20" y="40" width="40" height="4" rx="2" fill="#9CA3AF" />
            <rect x="20" y="50" width="22" height="4" rx="2" fill="#9CA3AF" />
            <circle cx="60" cy="56" r="16" fill="#DBEAFE" />
            <path d="M60 48v16M52 56h16" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}
      </svg>
      <h3>{hasFilters ? 'No matching tasks found' : 'No tasks yet'}</h3>
      <p>
        {hasFilters
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Your board is empty. Create your first task to get started.'}
      </p>
      {hasFilters && (
        <button className="button button-secondary" type="button" onClick={onClearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  )
}

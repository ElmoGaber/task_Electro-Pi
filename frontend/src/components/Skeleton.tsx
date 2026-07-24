export function SkeletonPage({ rows = 2 }: { rows?: number }) {
  return (
    <div className="skeleton-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div><div className="skeleton-line-md" style={{ width: 180, marginBottom: 6 }} /><div className="skeleton-line-sm" style={{ width: 240 }} /></div>
        <div className="skeleton-block" style={{ width: 120, height: 38 }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="skeleton-card">
              <div className="skeleton-block" style={{ height: 80 }} />
              <div className="skeleton-line-sm" style={{ width: '70%' }} />
              <div className="skeleton-line-sm" style={{ width: '50%' }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line-sm" style={{ width: '60%' }} />
      <div className="skeleton-line-sm" style={{ width: '90%' }} />
      <div className="skeleton-line-sm" style={{ width: '40%' }} />
    </div>
  )
}

export function SkeletonStatRow() {
  return (
    <div className="skeleton-row">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-block" style={{ height: 80 }} />
      ))}
    </div>
  )
}

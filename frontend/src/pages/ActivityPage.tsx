import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeActivities, fakeUsers } from '@/lib/fakeData'

const typeColors: Record<string, string> = { completed: '#22C55E', created: '#4F7CFF', urgent: '#EF4444', warning: '#F59E0B', info: '#94A3B8' }
const typeIcons: Record<string, string> = { completed: '✅', created: '➕', urgent: '🔴', warning: '⚠️', info: 'ℹ️' }

export function ActivityPage() {
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 25

  const grouped = useMemo(() => {
    let items = [...fakeActivities]
    if (filter !== 'All') items = items.filter((a) => a.type === filter)
    if (search.trim()) items = items.filter((a) => a.user.toLowerCase().includes(search.toLowerCase()) || a.action.includes(search) || a.target.toLowerCase().includes(search))

    const groups: Record<string, typeof items> = {}
    for (const item of items) {
      const key = item.time.includes('d') ? 'Older' : item.time.includes('h') ? 'Today' : 'This Hour'
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    }
    return groups
  }, [filter, search])

  const allItems = Object.values(grouped).flat()
  const paginated = allItems.slice(0, page * perPage)

  const filters = ['All', 'completed', 'created', 'urgent', 'warning', 'info']

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-header-wrap">
        <div><h1>Activity Log</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track every action across your workspace</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', width: 200 }} placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="button">Export Log</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button key={f} className={`button ${filter === f ? '' : 'button-secondary'} button-sm`} onClick={() => { setFilter(f); setPage(1) }}>
            {f !== 'All' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: typeColors[f], marginRight: 4 }} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {Object.entries(grouped).map(([groupName, items]) => {
          const visible = items.slice(0, groupName === 'This Hour' ? 50 : page * perPage)
          return (
            <div key={groupName}>
              <h3 style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{groupName}</h3>
              <div className="card" style={{ padding: '0.4rem 0' }}>
                {visible.map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.8rem', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${typeColors[a.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{typeIcons[a.type] || '•'}</div>
                    <div style={{ flex: 1, fontSize: '0.82rem' }}>
                      <strong>{a.user}</strong> <span style={{ color: 'var(--text-secondary)' }}>{a.action}</span> <em style={{ color: 'var(--text-tertiary)' }}>{a.target}</em>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{a.time}</span>
                      <button className="button-icon button-icon-sm" title="More">⋯</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {paginated.length < allItems.length && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="button button-secondary" onClick={() => setPage((p) => p + 1)}>Load More ({allItems.length - paginated.length} remaining)</button>
        </div>
      )}
    </motion.div>
    </AppLayout>
  )
}

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
  const [menuId, setMenuId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const perPage = 25

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

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

  const handleExport = () => {
    const dataStr = JSON.stringify(fakeActivities, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('📥 Activity log exported!')
  }

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.2rem', borderRadius: 'var(--radius)', zIndex: 500, fontSize: '0.85rem', boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
      <div className="page-header-wrap">
        <div><h1>Activity Log</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track every action across your workspace</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', width: 200 }} placeholder="Search activity..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="button" onClick={handleExport}>📥 Export Log</button>
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

      {allItems.length === 0 && (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
          <h3>No activity found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No activity matches your current filters.</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {Object.entries(grouped).map(([groupName, items]) => {
          const visible = items.slice(0, groupName === 'This Hour' ? 50 : page * perPage)
          return (
            <div key={groupName}>
              <h3 style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{groupName}</h3>
              <div className="card" style={{ padding: '0.4rem 0' }}>
                {visible.map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.8rem', borderBottom: '1px solid var(--border)', transition: 'background 0.15s', position: 'relative' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; setMenuId(null) }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${typeColors[a.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{typeIcons[a.type] || '•'}</div>
                    <div style={{ flex: 1, fontSize: '0.82rem' }}>
                      <strong>{a.user}</strong> <span style={{ color: 'var(--text-secondary)' }}>{a.action}</span> <em style={{ color: 'var(--text-tertiary)' }}>{a.target}</em>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{a.time}</span>
                      <button className="button-icon button-icon-sm" title="More" onClick={() => setMenuId(menuId === a.id ? null : a.id)}>⋯</button>
                      {menuId === a.id && (
                        <div style={{ position: 'absolute', top: '100%', right: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 50, minWidth: 140, overflow: 'hidden' }}>
                          <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`📄 Details: ${a.action} ${a.target}`); setMenuId(null) }}>📄 View Details</button>
                          <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { navigator.clipboard.writeText(`${a.user} ${a.action} ${a.target}`); showToast('📋 Copied!'); setMenuId(null) }}>📋 Copy</button>
                        </div>
                      )}
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

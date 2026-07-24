import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeNotifications } from '@/lib/fakeData'

const typeColors: Record<string, string> = { info: '#4F7CFF', warning: '#F59E0B', success: '#22C55E', danger: '#EF4444' }
const typeIcons: Record<string, string> = { info: 'ℹ️', warning: '⚠️', success: '✅', danger: '🔴' }

export function NotificationsPage() {
  const [filter, setFilter] = useState<string>('All')
  const [notifs, setNotifs] = useState(fakeNotifications)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    if (filter === 'All') return notifs
    if (filter === 'Unread') return notifs.filter((n) => !n.read)
    return notifs.filter((n) => n.type === filter)
  }, [filter, notifs])

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  const toggleRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n))

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }
  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((n) => n.id)))
  }
  const batchRead = () => {
    setNotifs((prev) => prev.map((n) => selected.has(n.id) ? { ...n, read: true } : n))
    setSelected(new Set())
  }
  const batchDelete = () => {
    setNotifs((prev) => prev.filter((n) => !selected.has(n.id)))
    setSelected(new Set())
  }

  const filters = ['All', 'Unread', 'info', 'warning', 'success', 'danger']

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-header-wrap">
        <div><h1>Notifications</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{notifs.filter((n) => !n.read).length} unread</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="button button-secondary button-sm" onClick={markAllRead}>Mark All Read</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button key={f} className={`button ${filter === f ? '' : 'button-secondary'} button-sm`} onClick={() => { setFilter(f); setSelected(new Set()) }}>
            {f !== 'All' && f !== 'Unread' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: typeColors[f] || 'var(--text-tertiary)', marginRight: 4 }} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          {selected.size > 0 && (
            <>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{selected.size} selected</span>
              <button className="button button-xs" onClick={batchRead} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>✓ Read</button>
              <button className="button button-secondary button-xs" onClick={batchDelete} style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}>🗑 Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: '0.4rem 0' }}>
        {filtered.length > 0 && (
          <div style={{ padding: '0.4rem 0.8rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} style={{ accentColor: 'var(--primary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{selected.size === filtered.length ? 'Deselect all' : 'Select all'}</span>
          </div>
        )}
        {filtered.map((n) => (
          <div key={n.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.8rem', cursor: 'pointer',
            borderBottom: '1px solid var(--border)', opacity: n.read ? 0.5 : 1, transition: 'all 0.15s',
            background: selected.has(n.id) ? 'var(--primary-bg)' : 'transparent',
          }} onMouseEnter={(e) => { if (!selected.has(n.id)) e.currentTarget.style.background = 'var(--bg-elevated)' }}
            onMouseLeave={(e) => { if (!selected.has(n.id)) e.currentTarget.style.background = 'transparent' }}>
            <input type="checkbox" checked={selected.has(n.id)} onChange={() => toggleSelect(n.id)} onClick={(e) => e.stopPropagation()} style={{ accentColor: 'var(--primary)' }} />
            <div onClick={() => toggleRead(n.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${typeColors[n.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>{typeIcons[n.type]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem' }}>{n.text}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{n.time}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No notifications</div>}
      </div>
    </motion.div>
    </AppLayout>
  )
}

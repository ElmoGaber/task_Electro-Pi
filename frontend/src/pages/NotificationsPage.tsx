import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeNotifications } from '@/lib/fakeData'

const typeColors: Record<string, string> = { info: '#4F7CFF', warning: '#F59E0B', success: '#22C55E', danger: '#EF4444' }
const typeIcons: Record<string, string> = { info: 'ℹ️', warning: '⚠️', success: '✅', danger: '🔴' }

export function NotificationsPage() {
  const [filter, setFilter] = useState<string>('All')
  const [notifs, setNotifs] = useState(fakeNotifications)

  const filtered = useMemo(() => {
    if (filter === 'All') return notifs
    if (filter === 'Unread') return notifs.filter((n) => !n.read)
    return notifs.filter((n) => n.type === filter)
  }, [filter, notifs])

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  const toggleRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: !n.read } : n))

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

      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button key={f} className={`button ${filter === f ? '' : 'button-secondary'} button-sm`} onClick={() => setFilter(f)}>
            {f !== 'All' && f !== 'Unread' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: typeColors[f] || 'var(--text-tertiary)', marginRight: 4 }} />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '0.4rem 0' }}>
        {filtered.map((n) => (
          <div key={n.id} onClick={() => toggleRead(n.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.6rem 0.8rem', cursor: 'pointer',
            borderBottom: '1px solid var(--border)', opacity: n.read ? 0.5 : 1, transition: 'all 0.15s',
          }} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${typeColors[n.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>{typeIcons[n.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem' }}>{n.text}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No notifications</div>}
      </div>
    </motion.div>
    </AppLayout>
  )
}

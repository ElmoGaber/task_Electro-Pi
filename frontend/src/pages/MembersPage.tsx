import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeUsers } from '@/lib/fakeData'

const deptColors: Record<string, string> = { Engineering: '#4F7CFF', Design: '#8A4DFF', Product: '#22C55E', Marketing: '#FF8A4C', Support: '#F59E0B', Sales: '#EF4444' }
const roles = ['All', 'Admin', 'Manager', 'Developer', 'Designer', 'Viewer']

export function MembersPage() {
  const [roleFilter, setRoleFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = useMemo(() => {
    let items = [...fakeUsers]
    if (roleFilter !== 'All') items = items.filter((u) => u.role === roleFilter)
    if (search.trim()) items = items.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search) || u.department.toLowerCase().includes(search))
    return items
  }, [roleFilter, search])

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    fakeUsers.forEach((u) => { counts[u.department] = (counts[u.department] || 0) + 1 })
    return counts
  }, [])

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="page-header-wrap">
        <div><h1>Team Members</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{fakeUsers.length} members across {Object.keys(deptCounts).length} departments</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', width: 200 }} placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="button">+ Invite</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {roles.map((r) => (
          <button key={r} className={`button ${roleFilter === r ? '' : 'button-secondary'} button-sm`} onClick={() => setRoleFilter(r)}>{r}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
          <button className={`button ${view === 'grid' ? '' : 'button-secondary'} button-sm`} onClick={() => setView('grid')}>▦ Grid</button>
          <button className={`button ${view === 'list' ? '' : 'button-secondary'} button-sm`} onClick={() => setView('list')}>≡ List</button>
        </div>
      </div>

      {/* Department summary */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(deptCounts).map(([dept, count]) => (
          <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', fontSize: '0.78rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: deptColors[dept] || 'var(--text-tertiary)' }} />
            <span>{dept}</span><span style={{ color: 'var(--text-tertiary)' }}>{count}</span>
          </div>
        ))}
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {filtered.map((u, i) => (
            <motion.div key={u.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              whileHover={{ y: -3, boxShadow: 'var(--shadow-md)' }} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 auto 0.5rem' }}>{u.avatar}</div>
              <h3 style={{ fontSize: '0.9rem', margin: 0 }}>{u.name}</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>{u.role} · {u.department}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{u.email}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.3rem' }}>📅 Joined {u.joined}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
                <button className="button-icon button-icon-sm" title="Message">💬</button>
                <button className="button-icon button-icon-sm" title="Profile">👤</button>
                <button className="button-icon button-icon-sm" title="More">⋯</button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['Member', 'Role', 'Department', 'Email', 'Phone', 'Joined', ''].map((h) => <th key={h} style={{ padding: '0.7rem 0.8rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>{u.avatar}</div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '0.5rem 0.8rem' }}><span className={`badge badge--${u.role === 'Admin' ? 'done' : u.role === 'Manager' ? 'progress' : 'todo'}`}>{u.role}</span></td>
                  <td style={{ padding: '0.5rem 0.8rem', color: 'var(--text-secondary)' }}>{u.department}</td>
                  <td style={{ padding: '0.5rem 0.8rem', color: 'var(--text-tertiary)' }}>{u.email}</td>
                  <td style={{ padding: '0.5rem 0.8rem', color: 'var(--text-tertiary)' }}>{u.phone}</td>
                  <td style={{ padding: '0.5rem 0.8rem', color: 'var(--text-tertiary)' }}>{u.joined}</td>
                  <td style={{ padding: '0.5rem 0.8rem' }}><button className="button-icon button-icon-sm">⋯</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
    </AppLayout>
  )
}

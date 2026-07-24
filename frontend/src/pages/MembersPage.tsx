import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { InviteMemberModal } from '@/components/InviteMemberModal'
import { fakeUsers, genId } from '@/lib/fakeData'

const deptColors: Record<string, string> = { Engineering: '#4F7CFF', Design: '#8A4DFF', Product: '#22C55E', Marketing: '#FF8A4C', Support: '#F59E0B', Sales: '#EF4444' }
const roles = ['All', 'Admin', 'Manager', 'Developer', 'Designer', 'Viewer']

const colorPalette = ['#4F7CFF','#8A4DFF','#FF8A4C','#22C55E','#F59E0B','#EF4444','#FF6B9D','#4DD8FF','#A78BFA','#34D399']

export function MembersPage() {
  const [roleFilter, setRoleFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [menuId, setMenuId] = useState<string | null>(null)
  const [users, setUsers] = useState(fakeUsers)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleInvite = (data: { name: string; email: string; role: string; department: string }) => {
    const initials = data.name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
    const newUser = {
      id: genId(), name: data.name, email: data.email, avatar: initials,
      role: data.role, department: data.department, phone: '-', joined: 'Today',
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      bio: 'New team member', tasksCompleted: 0, rating: 0, timezone: 'UTC+0',
    }
    setUsers((prev) => [newUser, ...prev])
    showToast(`✉️ Invitation sent to ${data.name} (${data.email})`)
  }

  const filtered = useMemo(() => {
    let items = [...users]
    if (roleFilter !== 'All') items = items.filter((u) => u.role === roleFilter)
    if (search.trim()) items = items.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search) || u.department.toLowerCase().includes(search))
    return items
  }, [roleFilter, search, users])

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    users.forEach((u) => { counts[u.department] = (counts[u.department] || 0) + 1 })
    return counts
  }, [users])

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.2rem', borderRadius: 'var(--radius)', zIndex: 500, fontSize: '0.85rem', boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
      <div className="page-header-wrap">
        <div><h1>Team Members</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{users.length} members across {Object.keys(deptCounts).length} departments</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', width: 200 }} placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="button" onClick={() => setShowInviteModal(true)}>+ Invite</button>
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

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {Object.entries(deptCounts).map(([dept, count]) => (
          <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', fontSize: '0.78rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: deptColors[dept] || 'var(--text-tertiary)' }} />
            <span>{dept}</span><span style={{ color: 'var(--text-tertiary)' }}>{count}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
          <h3>No members found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Try a different role filter or search term.</p>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {filtered.map((u, i) => (
            <motion.div key={u.id} className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
              whileHover={{ y: -3, boxShadow: 'var(--shadow-md)' }} style={{ cursor: 'pointer', textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 auto 0.5rem' }}>{u.avatar}</div>
              <h3 style={{ fontSize: '0.9rem', margin: 0 }}>{u.name}</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0' }}>{u.role} · {u.department}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{u.email}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.3rem' }}>📅 Joined {u.joined}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem', marginTop: '0.5rem' }}>
                <button className="button-icon button-icon-sm" title="Message" onClick={() => showToast(`💬 Messaging ${u.name}...`)}>💬</button>
                <button className="button-icon button-icon-sm" title="Profile" onClick={() => showToast(`👤 ${u.name}: ${u.role} · ${u.department} · ${u.email}`)}>👤</button>
                <div style={{ position: 'relative' }}>
                  <button className="button-icon button-icon-sm" title="More" onClick={() => setMenuId(menuId === u.id ? null : u.id)}>⋯</button>
                  {menuId === u.id && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 50, minWidth: 150, overflow: 'hidden' }}>
                      <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`👤 ${u.name} profile`); setMenuId(null) }}>👤 View Profile</button>
                      <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`💬 Messaging ${u.name}...`); setMenuId(null) }}>💬 Send Message</button>
                      <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--red)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`🚫 ${u.name} removed from workspace`); setMenuId(null) }}>🚫 Remove</button>
                    </div>
                  )}
                </div>
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
                  <td style={{ padding: '0.5rem 0.8rem', position: 'relative' }}>
                    <button className="button-icon button-icon-sm" onClick={() => setMenuId(menuId === u.id ? null : u.id)}>⋯</button>
                    {menuId === u.id && (
                      <div style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', zIndex: 50, minWidth: 150, overflow: 'hidden' }}>
                        <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`👤 ${u.name} profile`); setMenuId(null) }}>👤 View Profile</button>
                        <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--text)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`💬 Messaging ${u.name}...`); setMenuId(null) }}>💬 Send Message</button>
                        <button style={{ display: 'block', width: '100%', padding: '0.45rem 0.8rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.78rem', color: 'var(--red)', textAlign: 'left', fontFamily: 'inherit' }} onClick={() => { showToast(`🚫 ${u.name} removed`); setMenuId(null) }}>🚫 Remove</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <InviteMemberModal open={showInviteModal} onClose={() => setShowInviteModal(false)} onSubmit={handleInvite} />
    </motion.div>
    </AppLayout>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { ProjectModal } from '@/components/ProjectModal'
import { fakeProjects, fakeUsers, fakeActivities, fakeMessages, fakeEvents, genId } from '@/lib/fakeData'
import { useAuth } from '@/context/useAuth'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

export function OverviewPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [greeting] = useState(() => {
    const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  })
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set())
  const [projects, setProjects] = useState(fakeProjects)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleCreateProject = (data: { name: string; description: string; status: string; priority: string; deadline: string; owner: string; image: string; color: string }) => {
    const newProject = {
      id: genId(), name: data.name, description: data.description, status: data.status, priority: data.priority,
      deadline: data.deadline, owner: data.owner, image: data.image, color: data.color,
      members: 1, progress: 0, tasks: 0, completed: 0, budget: '$0', tech: [], lastActivity: 'just now',
    }
    setProjects((prev) => [newProject, ...prev])
    showToast(`📂 Project "${data.name}" created!`)
  }

  const upcoming = projects.filter((p) => p.status === 'In Progress').slice(0, 4)
  const recent = fakeActivities.slice(0, 10)
  const msgs = fakeMessages.filter((m) => m.unread).slice(0, 4)
  const tasksToday = projects.slice(0, 5)
  const teamPreview = fakeUsers.slice(0, 8)
  const eventsToday = fakeEvents.slice(0, 3)

  return (
    <AppLayout>
    <motion.div className="overview-page" variants={container} initial="hidden" animate="show">
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.2rem', borderRadius: 'var(--radius)', zIndex: 500, fontSize: '0.85rem', boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
      <motion.div className="page-header-wrap" variants={item}>
        <div>
          <h1 style={{ fontSize: '1.6rem' }}>{greeting}, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Here's what's happening with your projects today.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="button" onClick={() => setShowProjectModal(true)}>+ New Project</button>
        </div>
      </motion.div>

      <motion.div className="overview-stats" variants={item}>
        {[
          { label: 'Total Projects', value: fakeProjects.length, color: 'var(--primary)', icon: '📁' },
          { label: 'Active Tasks', value: fakeProjects.reduce((a, p) => a + p.tasks, 0), color: 'var(--purple)', icon: '📋' },
          { label: 'Team Members', value: fakeUsers.length, color: 'var(--green)', icon: '👥' },
          { label: 'Completed', value: fakeProjects.filter((p) => p.status === 'Completed').length, color: 'var(--orange)', icon: '✅' },
        ].map((s) => (
          <div key={s.label} className="overview-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="overview-stat-icon" style={{ background: `${s.color}15` }}>{s.icon}</div>
            <div className="overview-stat-value">{s.value}</div>
            <div className="overview-stat-label">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
        <motion.div className="card" variants={item}>
          <div className="section-header"><h2>Project Timeline</h2><span className="see-all" onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>See All</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {upcoming.map((p) => (
              <div key={p.id} className="timeline-bar-wrap">
                <span className="timeline-bar-label">{p.name}</span>
                <div className="timeline-bar" style={{ width: `${p.progress}%`, background: p.color, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 0.6rem', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: '0.72rem' }}>{p.progress}%</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem' }}>{p.members} members</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" variants={item}>
          <div className="section-header"><h2>Recent Activity</h2><span className="see-all" onClick={() => navigate('/activity')} style={{ cursor: 'pointer' }}>See All</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {recent.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', flex: 1 }}>
                  <strong>{a.user}</strong> {a.action} <em style={{ color: 'var(--text-secondary)' }}>{a.target}</em>
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <motion.div className="card" variants={item}>
          <div className="section-header"><h2>Today's Tasks</h2></div>
          <div className="today-list">
            {tasksToday.map((p) => {
              const isChecked = checkedTasks.has(p.id)
              return (
                <div key={p.id} className="today-item">
                  <button className={`today-check${isChecked ? ' checked' : ''}`} type="button" onClick={() => toggleTask(p.id)}>
                    {isChecked && <span className="today-check-inner">✓</span>}
                  </button>
                  <div className="today-item-content">
                    <div className="today-item-title" style={{ textDecoration: isChecked ? 'line-through' : 'none', opacity: isChecked ? 0.5 : 1 }}>{p.name}</div>
                    <div className="today-item-desc">{p.description.slice(0, 40)}...</div>
                    <div className="today-item-time">🕐 {p.deadline}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div className="card" variants={item}>
          <div className="section-header"><h2>Team</h2><span className="see-all" onClick={() => navigate('/members')} style={{ cursor: 'pointer' }}>See All</span></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {teamPreview.map((u) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', width: 'calc(50% - 0.25rem)', cursor: 'pointer' }} onClick={() => navigate('/members')}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700, flexShrink: 0 }}>{u.avatar}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{u.name.split(' ')[0]}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-tertiary)' }}>{u.role}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="card" variants={item}>
          <div className="section-header"><h2>Upcoming</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {eventsToday.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', cursor: 'pointer' }} onClick={() => navigate('/calendar')}>
                <div style={{ width: 4, height: 36, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>{e.date} · {e.start} - {e.end}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div className="card" variants={item}>
        <div className="section-header"><h2>Recent Messages</h2><span className="see-all" onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>See All</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {msgs.map((m) => {
            const u = fakeUsers.find((x) => x.id === m.id)
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => navigate('/messages')}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u?.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>{u?.avatar || '?'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{m.from}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.text}</div>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>{m.time}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
      <ProjectModal open={showProjectModal} onClose={() => setShowProjectModal(false)} onSubmit={handleCreateProject} />
    </motion.div>
    </AppLayout>
  )
}

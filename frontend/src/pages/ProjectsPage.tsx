import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { ProjectModal } from '@/components/ProjectModal'
import { fakeProjects, fakeUsers, genId } from '@/lib/fakeData'

type ViewMode = 'grid' | 'kanban' | 'table'
type FilterStatus = 'All' | 'Completed' | 'In Progress' | 'Pending' | 'Archived'

export function ProjectsPage() {
  const [view, setView] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<FilterStatus>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)
  const [projects, setProjects] = useState(fakeProjects)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')
  const perPage = 8

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const handleCreateProject = (data: { name: string; description: string; status: string; priority: string; deadline: string; owner: string; image: string; color: string }) => {
    const newProject = {
      id: genId(), name: data.name, description: data.description, status: data.status, priority: data.priority,
      deadline: data.deadline, owner: data.owner, image: data.image, color: data.color,
      members: 1, progress: 0, tasks: 0, completed: 0, budget: '$0', tech: [], lastActivity: 'just now',
    }
    setProjects((prev) => [newProject, ...prev])
    showToast(`📂 Project "${data.name}" created!`)
  }

  const filtered = useMemo(() => {
    let items = [...projects]
    if (filter !== 'All') items = items.filter((p) => p.status === filter)
    if (search.trim()) items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'progress') items.sort((a, b) => b.progress - a.progress)
    if (sort === 'deadline') items.sort((a, b) => a.deadline.localeCompare(b.deadline))
    return items
  }, [filter, search, sort, projects])

  const paginated = filtered.slice(0, page * perPage)
  const filters: FilterStatus[] = ['All', 'Completed', 'In Progress', 'Pending', 'Archived']

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.2rem', borderRadius: 'var(--radius)', zIndex: 500, fontSize: '0.85rem', boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
      <div className="page-header-wrap">
        <div><h1>Projects</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Manage all your projects in one place</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input style={{ padding: '0.5rem 0.8rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.82rem', width: 200 }} placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="button" onClick={() => setShowModal(true)}>+ New Project</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {filters.map((f) => (
          <button key={f} className={`button ${filter === f ? '' : 'button-secondary'} button-sm`} onClick={() => { setFilter(f); setPage(1) }}>{f}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
          {(['grid', 'kanban', 'table'] as ViewMode[]).map((v) => (
            <button key={v} className={`button ${view === v ? '' : 'button-secondary'} button-sm`} onClick={() => setView(v)}>{v === 'grid' ? '▦' : v === 'kanban' ? '≡' : '⊟'} {v}</button>
          ))}
          <select style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.78rem' }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Name</option><option value="progress">Progress</option><option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {view === 'grid' && filtered.length === 0 && (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
          <h3>No projects found</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Try adjusting your search or filter criteria.</p>
        </div>
      )}
      {view === 'grid' && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {paginated.map((p, i) => (
            <motion.div key={p.id} className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3, boxShadow: 'var(--shadow-md)' }} style={{ cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => showToast(`📄 ${p.name}: ${p.description.slice(0, 60)}...`)}>
              <div style={{ height: 100, background: `linear-gradient(135deg, ${p.color}, ${p.color}88)`, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>{p.image}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{p.name}</h3>
                <span className={`badge badge--${p.status === 'In Progress' ? 'progress' : p.status === 'Pending' ? 'todo' : p.status === 'Archived' ? 'done' : 'done'}`}>{p.status}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0.35rem 0' }}>{p.description.slice(0, 60)}...</p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>👤 {p.owner} · 👥 {p.members} members</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                <span>📅 {p.deadline}</span>
                <span>✅ {p.completed}/{p.tasks}</span>
              </div>
              <div className="kanban-card-progress" style={{ marginTop: '0.4rem' }}>
                <div className="kanban-card-progress-bar"><div className="kanban-card-progress-fill" style={{ width: `${p.progress}%`, background: p.color }} /></div>
                <span className="kanban-card-progress-text">{p.progress}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {view === 'kanban' && filtered.length === 0 && (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
          <h3>No projects to display</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No projects match your current filters.</p>
        </div>
      )}
      {view === 'kanban' && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {[['Pending', '#F59E0B'], ['In Progress', '#4F7CFF'], ['Completed', '#22C55E'], ['Archived', '#94A3B8']].map(([status, color]) => (
            <div key={status} className="kanban-col">
              <div className="kanban-col-header"><span className="kanban-col-dot" style={{ background: color }} /><span>{status}</span><span className="kanban-col-count">{filtered.filter((p) => p.status === status).length}</span></div>
              <div className="kanban-col-body">
                {filtered.filter((p) => p.status === status).map((p) => (
                  <div key={p.id} className="kanban-card" style={{ cursor: 'pointer' }} onClick={() => showToast(`📄 ${p.name}`)}>
                    <div className="kanban-card-head"><h4>{p.name}</h4></div>
                    <div className="kanban-card-meta"><span className={`kanban-card-label kanban-card-label--${p.priority === 'High' ? 'pink' : p.priority === 'Medium' ? 'orange' : 'green'}`}>{p.priority}</span></div>
                    <div className="kanban-card-progress"><div className="kanban-card-progress-bar"><div className="kanban-card-progress-fill" style={{ width: `${p.progress}%`, background: color }} /></div></div>
                    <div className="kanban-card-footer"><span>👥 {p.members}</span><span>✅ {p.completed}/{p.tasks}</span></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'table' && filtered.length === 0 && (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <h3>No table data</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Try a different filter or search term.</p>
        </div>
      )}
      {view === 'table' && filtered.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              {['Name', 'Status', 'Priority', 'Progress', 'Owner', 'Deadline', 'Tasks'].map((h) => <th key={h} style={{ padding: '0.7rem 0.8rem', textAlign: 'left', fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => showToast(`📄 ${p.name}`)}>
                  <td style={{ padding: '0.6rem 0.8rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '0.6rem 0.8rem' }}><span className={`badge badge--${p.status === 'In Progress' ? 'progress' : p.status === 'Pending' ? 'todo' : 'done'}`}>{p.status}</span></td>
                  <td style={{ padding: '0.6rem 0.8rem' }}>{p.priority}</td>
                  <td style={{ padding: '0.6rem 0.8rem' }}>
                    <div style={{ width: 80, height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${p.progress}%`, height: '100%', background: p.color, borderRadius: 2 }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.8rem', color: 'var(--text-secondary)' }}>{p.owner}</td>
                  <td style={{ padding: '0.6rem 0.8rem', color: 'var(--text-tertiary)' }}>{p.deadline}</td>
                  <td style={{ padding: '0.6rem 0.8rem' }}>{p.completed}/{p.tasks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paginated.length < filtered.length && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button className="button button-secondary" onClick={() => setPage((p) => p + 1)}>Load More ({filtered.length - paginated.length} remaining)</button>
        </div>
      )}

      <ProjectModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreateProject} />
    </motion.div>
    </AppLayout>
  )
}

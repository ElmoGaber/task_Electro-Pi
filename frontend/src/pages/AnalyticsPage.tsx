import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useAuth } from '@/context/useAuth'
import { useTheme } from '@/context/useTheme'
import { useTaskList } from '@/hooks/useTasks'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SettingsBar } from '@/components/SettingsBar'

const COLORS = { 'To Do': '#6366f1', 'In Progress': '#f59e0b', Done: '#10b981' }
const PRIORITY_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' }

export function AnalyticsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const pageRef = useRef<HTMLDivElement>(null)

  const { data: tasks, isLoading } = useTaskList({})

  const statusData = useMemo(() => {
    if (!tasks) return []
    const counts: Record<string, number> = { 'To Do': 0, 'In Progress': 0, Done: 0 }
    tasks.forEach((t) => { counts[t.status]++ })
    return Object.entries(counts).map(([name, value]) => ({ name: t(`status.${name}`), value, fill: COLORS[name as keyof typeof COLORS] }))
  }, [tasks, t])

  const priorityData = useMemo(() => {
    if (!tasks) return []
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 }
    tasks.forEach((t) => { counts[t.priority]++ })
    return Object.entries(counts).map(([name, value]) => ({ name: t(`priority.${name}`), value, fill: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS] }))
  }, [tasks, t])

  const overdueCount = useMemo(() => {
    if (!tasks) return 0
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return tasks.filter((t) => t.status !== 'Done' && new Date(t.dueDate) < today).length
  }, [tasks])

  if (isLoading) {
    return <div className="container"><p>{t('app.loading')}</p></div>
  }

  return (
    <main className="container" ref={pageRef}>
      <header className="page-header">
        <div className="page-header-left">
          <h1>{t('dashboard.analytics')}</h1>
          <span className="subtle">{t('app.welcome', { name: user?.name || 'User' })}</span>
        </div>
        <div className="actions">
          <LanguageToggle />
          <SettingsBar />
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
          </button>
          <button className="button button-ghost button-sm" type="button" onClick={() => navigate('/')}>
            {t('tasks.backToDashboard')}
          </button>
          <button className="button button-secondary button-sm" type="button" onClick={logout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      <div className="analytics-grid">
        <div className="card stat-card">
          <div className="stat-value">{tasks?.length ?? 0}</div>
          <div className="stat-label">{t('dashboard.total')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{statusData.find((s) => s.name === t('status.To Do'))?.value ?? 0}</div>
          <div className="stat-label">{t('dashboard.toDo')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{statusData.find((s) => s.name === t('status.In Progress'))?.value ?? 0}</div>
          <div className="stat-label">{t('dashboard.inProgress')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{statusData.find((s) => s.name === t('status.Done'))?.value ?? 0}</div>
          <div className="stat-label">{t('dashboard.done')}</div>
        </div>
        <div className="card stat-card stat-card--danger">
          <div className="stat-value">{overdueCount}</div>
          <div className="stat-label">{t('dashboard.overdue')}</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card chart-card">
          <h3>{t('analytics.byStatus', 'Tasks by Status')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3>{t('analytics.byPriority', 'Tasks by Priority')}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  )
}

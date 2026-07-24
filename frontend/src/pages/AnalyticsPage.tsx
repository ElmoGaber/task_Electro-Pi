import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { AppLayout } from '@/components/AppLayout'
import { useTaskList } from '@/hooks/useTasks'

const COLORS = { 'To Do': '#8A4DFF', 'In Progress': '#FF8A4C', Done: '#4CD964' }
const PRIORITY_COLORS = { Low: '#4CD964', Medium: '#FFD84D', High: '#FF3B30' }

export function AnalyticsPage() {
  const { t } = useTranslation()

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

  const total = tasks?.length ?? 0
  const done = tasks?.filter((t) => t.status === 'Done').length ?? 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  if (isLoading) {
    return (
      <AppLayout tasks={tasks} showRightPanel={false}>
        <p>{t('app.loading')}...</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout tasks={tasks} showRightPanel={false}>
      <div className="page-header-wrap">
        <div>
          <h1>{t('dashboard.analytics')}</h1>
          <p>{t('analytics.subtitle', 'Track your productivity and progress')}</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-card--orange">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.total')}</span>
            <span className="stat-card-number">{total}</span>
          </div>
          <div className="stat-card-icon">📊</div>
        </div>
        <div className="stat-card stat-card--purple">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.done')}</span>
            <span className="stat-card-number">{done}</span>
          </div>
          <div className="stat-card-icon">✓</div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.completed', 'Completion')}</span>
            <span className="stat-card-number">{pct}%</span>
          </div>
          <div className="stat-card-icon">📈</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card chart-card">
          <h3>{t('analytics.byStatus')}</h3>
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
          <h3>{t('analytics.byPriority')}</h3>
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
    </AppLayout>
  )
}

import { useTranslation } from 'react-i18next'
import type { Task } from '@/types'
import { SkeletonCard } from './SkeletonCard'

interface TasksGridViewProps {
  tasks: Task[] | undefined
  loading: boolean
  error: Error | null
  hasFilters: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onClearFilters: () => void
}

function isOverdue(dueDate: string): boolean {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

const PRIORITY_EMOJI: Record<string, string> = { High: '\u{1F534}', Medium: '\u{1F7E1}', Low: '\u{1F7E2}' }

export function TasksGridView({ tasks, loading, error, hasFilters, onEdit, onDelete, onClearFilters }: TasksGridViewProps) {
  const { t } = useTranslation()

  if (loading) {
    return <div className="task-list">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>
  }

  if (error) {
    return <div className="card feedback error-box" role="alert">{error.message}</div>
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card empty-state animate-in">
        <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="12" y="20" width="56" height="48" rx="6" fill="var(--border)" />
          <rect x="20" y="30" width="30" height="4" rx="2" fill="var(--text-tertiary)" />
          <rect x="20" y="40" width="40" height="4" rx="2" fill="var(--text-tertiary)" />
          <circle cx="60" cy="56" r="16" fill="var(--primary-bg)" />
          <path d="M60 48v16M52 56h16" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <h3>{hasFilters ? t('dashboard.noMatch') : t('dashboard.noTasks')}</h3>
        <p>{hasFilters ? t('dashboard.noMatchDesc') : t('dashboard.noTasksDesc')}</p>
        {hasFilters && <button className="button button-secondary" type="button" onClick={onClearFilters}>{t('dashboard.clearFilters')}</button>}
      </div>
    )
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate) && task.status !== 'Done'
        return (
          <article className={`card task-item${overdue ? ' task-item--overdue' : ''} animate-pop`} key={task._id}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-meta">
                {overdue && <span className="badge badge-overdue">{t('dashboard.overdue')}</span>}
                <span className={`badge status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}>{t(`status.${task.status}`)}</span>
                <span className={`badge priority-${task.priority.toLowerCase()}`}>{PRIORITY_EMOJI[task.priority] ?? ''} {t(`priority.${task.priority}`)}</span>
              </div>
            </div>
            <p>{task.description}</p>
            {task.media && task.media.length > 0 && (
              <div className="kanban-card-media">
                {task.media.map((url, i) => (
                  url.match(/\.(mp3|wav|ogg|webm)$/i)
                    ? <audio key={i} src={url} controls className="kanban-audio" />
                    : <img key={i} src={url} alt="" className="kanban-img" />
                ))}
              </div>
            )}
            <p className="subtle">{t('dashboard.dueDate')}: {new Date(task.dueDate).toLocaleDateString()}{overdue && <span className="overdue-hint"> ({t('dashboard.overdue')})</span>}</p>
            <div className="actions" style={{ marginTop: '0.6rem' }}>
              <button className="button button-secondary button-sm" type="button" onClick={() => onEdit(task)}>{t('dashboard.edit')}</button>
              <button className="button button-danger button-sm" type="button" onClick={() => onDelete(task._id)}>{t('dashboard.delete')}</button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

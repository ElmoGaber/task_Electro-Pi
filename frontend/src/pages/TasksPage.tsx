import type { Task } from '@/types'
import { SkeletonCard } from '@/components/SkeletonCard'
import { EmptyState } from '@/components/EmptyState'
import { ExportMenu } from '@/components/ExportMenu'

interface TasksPageViewProps {
  tasks: Task[] | undefined
  loading: boolean
  error: Error | null
  hasFilters: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onClearFilters: () => void
}

const PRIORITY_EMOJI: Record<string, string> = {
  High: '\u{1F534}',
  Medium: '\u{1F7E1}',
  Low: '\u{1F7E2}',
}

function isOverdue(dueDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

export function TasksPage({
  tasks, loading, error, hasFilters, onEdit, onDelete, onClearFilters,
}: TasksPageViewProps) {
  if (loading) {
    return (
      <div className="task-list">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (error) {
    return <div className="card feedback error-box" role="alert">{error.message}</div>
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
  }

  const gridView = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate) && task.status !== 'Done'
        return (
          <article className={`card task-item${overdue ? ' task-item--overdue' : ''}`} key={task._id}
            style={{ animationDelay: `${Math.random() * 0.2}s` }}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-meta">
                {overdue && <span className="badge badge-overdue">Overdue</span>}
                <span className={`badge status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}>{task.status}</span>
                <span className={`badge priority-${task.priority.toLowerCase()}`}>
                  {PRIORITY_EMOJI[task.priority] ?? ''} {task.priority}
                </span>
              </div>
            </div>
            <p>{task.description}</p>
            <p className="subtle" style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {overdue && <span className="overdue-hint"> (overdue)</span>}
            </p>
            <div className="actions" style={{ marginTop: '0.6rem' }}>
              <button className="button button-secondary button-sm" onClick={() => onEdit(task)}>Edit</button>
              <button className="button button-danger button-sm" onClick={() => onDelete(task._id)}>Delete</button>
            </div>
          </article>
        )
      })}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <ExportMenu tasks={tasks} />
      </div>
      {gridView}
    </div>
  )
}

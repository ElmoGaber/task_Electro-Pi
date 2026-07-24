import type { Task } from '@/types'
import { SkeletonCard } from './SkeletonCard'
import { EmptyState } from './EmptyState'

interface TaskListProps {
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

export function TaskList({
  tasks,
  loading,
  error,
  hasFilters,
  onEdit,
  onDelete,
  onClearFilters,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="task-list">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="card feedback error-box" role="alert">
        {error.message}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClearFilters={onClearFilters} />
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate) && task.status !== 'Done'
        return (
          <article className={`card task-item${overdue ? ' task-item--overdue' : ''}`} key={task._id}>
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-meta">
                {overdue && <span className="badge badge-overdue">Overdue</span>}
                <span
                  className={`badge status-${task.status.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {task.status}
                </span>
                <span className={`badge priority-${task.priority.toLowerCase()}`}>
                  {PRIORITY_EMOJI[task.priority] ?? ''} {task.priority}
                </span>
              </div>
            </div>
            <p>{task.description}</p>
            <p className="subtle">
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {overdue && <span className="overdue-hint"> (overdue)</span>}
            </p>
            <div className="actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                type="button"
                onClick={() => onDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

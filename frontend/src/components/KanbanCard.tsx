import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import type { Task } from '@/types'

const PRIORITY_EMOJI: Record<string, string> = { High: '\u{1F534}', Medium: '\u{1F7E1}', Low: '\u{1F7E2}' }

function isOverdue(dueDate: string): boolean {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function KanbanCard({ task, onEdit, onDelete }: KanbanCardProps) {
  const { t } = useTranslation()
  const overdue = isOverdue(task.dueDate) && task.status !== 'Done'
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <article className={`kanban-card${overdue ? ' kanban-card--overdue' : ''}`}
      ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="kanban-card-head">
        <h4>{task.title}</h4>
        <span className={`badge priority-${task.priority.toLowerCase()}`}>
          {PRIORITY_EMOJI[task.priority] ?? ''} {task.priority}
        </span>
      </div>
      {task.description && <p className="kanban-card-desc">{task.description}</p>}
      <div className="kanban-card-meta">
        {overdue && <span className="badge badge-overdue">{t('dashboard.overdue')}</span>}
        <span className="kanban-card-date">{new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
      {task.media && task.media.length > 0 && (
        <div className="kanban-card-media">
          {task.media.map((url, i) => (
            url.match(/\.(mp3|wav|ogg|webm)$/i)
              ? <audio key={i} src={url} controls className="kanban-audio" />
              : <img key={i} src={url} alt="" className="kanban-img" />
          ))}
        </div>
      )}
      <div className="kanban-card-actions">
        <button className="button button-secondary button-sm" type="button" onClick={(e) => { e.stopPropagation(); onEdit(task) }}>
          {t('dashboard.edit')}
        </button>
        <button className="button button-danger button-sm" type="button" onClick={(e) => { e.stopPropagation(); onDelete(task._id) }}>
          {t('dashboard.delete')}
        </button>
      </div>
    </article>
  )
}

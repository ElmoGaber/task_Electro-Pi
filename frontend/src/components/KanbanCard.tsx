import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslation } from 'react-i18next'
import type { Task } from '@/types'

const LABELS: Record<string, { color: string; text: string }[]> = {
  'To Do': [{ color: 'blue', text: 'UI' }, { color: 'purple', text: 'Frontend' }],
  'In Progress': [{ color: 'orange', text: 'Dev' }, { color: 'cyan', text: 'API' }],
  'Done': [{ color: 'green', text: 'Done' }],
}

interface KanbanCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function KanbanCard({ task, onEdit, onDelete }: KanbanCardProps) {
  const { t } = useTranslation()
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  const labels = LABELS[task.status] ?? [{ color: 'blue', text: task.priority }]
  const progress = task.status === 'Done' ? 100 : task.status === 'In Progress' ? 60 : 20

  return (
    <article className="kanban-card" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="kanban-card-head">
        <h4>{task.title}</h4>
        <span style={{ color: '#FFD84D', fontSize: '0.85rem' }}>★</span>
      </div>
      <p className="kanban-card-desc">{task.description}</p>
      <div className="kanban-card-meta">
        {labels.map((l, i) => (
          <span key={i} className={`kanban-card-label kanban-card-label--${l.color}`}>{l.text}</span>
        ))}
      </div>
      <div className="kanban-card-progress">
        <div className="kanban-card-progress-bar">
          <div className="kanban-card-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="kanban-card-progress-text">{progress}%</span>
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
      <div className="kanban-card-footer">
        <div className="kanban-card-icons">
          <span>💬 {Math.floor(Math.random() * 8)}</span>
          <span>📎 {task.media?.length ?? 0}</span>
        </div>
        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
      </div>
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

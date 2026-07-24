import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import type { Task, TaskStatus } from '@/types'
import { KanbanCard } from './KanbanCard'

const COLUMNS: { status: TaskStatus; label: string; dot: string }[] = [
  { status: 'To Do', label: 'Draft', dot: '#8A4DFF' },
  { status: 'In Progress', label: 'In Progress', dot: '#FF8A4C' },
  { status: 'Editing', label: 'Editing', dot: '#4DD8FF' },
  { status: 'Done', label: 'Done', dot: '#4CD964' },
]

interface KanbanColumnProps {
  status: TaskStatus
  label: string
  dot: string
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function KanbanColumn({ status, label, dot, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks])

  return (
    <div className={`kanban-col${isOver ? ' kanban-col--over' : ''}`} ref={setNodeRef}>
      <div className="kanban-col-header">
        <span className="kanban-col-dot" style={{ background: dot }} />
        <span>{t(`kanban.${label.toLowerCase()}`, label)}</span>
        <span className="kanban-col-count">{tasks.length}</span>
      </div>
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="kanban-col-body">
          {tasks.length === 0 ? (
            <div className="kanban-empty">{t('kanban.dropHere', 'Drop tasks here')}</div>
          ) : (
            tasks.map((task) => (
              <KanbanCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

interface KanbanBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function KanbanBoard({ tasks, onEdit, onDelete }: KanbanBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { 'To Do': [], 'In Progress': [], 'Editing': [], 'Done': [] }
    tasks.forEach((t) => { if (map[t.status]) map[t.status].push(t) })
    return map
  }, [tasks])

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <KanbanColumn key={col.label} status={col.status} label={col.label} dot={col.dot} tasks={grouped[col.status]} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

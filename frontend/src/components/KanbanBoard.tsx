import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'
import type { Task, TaskStatus } from '@/types'
import { KanbanCard } from './KanbanCard'

const STATUS_ICON: Record<TaskStatus, string> = { 'To Do': '\u{1F4CB}', 'In Progress': '\u{1F3C3}', 'Done': '\u{2705}' }

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function KanbanColumn({ status, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks])

  return (
    <div className={`kanban-col${isOver ? ' kanban-col--over' : ''}`} ref={setNodeRef}>
      <div className="kanban-col-header">
        <span className="kanban-col-icon">{STATUS_ICON[status]}</span>
        <span>{t(`status.${status}`)}</span>
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

const COLUMNS: TaskStatus[] = ['To Do', 'In Progress', 'Done']

export function KanbanBoard({ tasks, onEdit, onDelete }: KanbanBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { 'To Do': [], 'In Progress': [], 'Done': [] }
    tasks.forEach((t) => { if (map[t.status]) map[t.status].push(t) })
    return map
  }, [tasks])

  return (
    <div className="kanban-board">
      {COLUMNS.map((status) => (
        <KanbanColumn key={status} status={status} tasks={grouped[status]} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

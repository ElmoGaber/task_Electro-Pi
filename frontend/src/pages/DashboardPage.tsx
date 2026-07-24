import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import type { Task, TaskStatus, TaskFiltersState } from '@/types'
import { AppLayout } from '@/components/AppLayout'
import { TaskForm } from '@/components/TaskForm'
import { TaskFilters } from '@/components/TaskFilters'
import { KanbanBoard } from '@/components/KanbanBoard'
import { KanbanCard } from '@/components/KanbanCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useTasks'

export function DashboardPage() {
  const { t } = useTranslation()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFiltersState>({ search: '', status: '', priority: '' })
  const [activeDrag, setActiveDrag] = useState<Task | null>(null)

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {}
    if (filters.search.trim()) params.search = filters.search.trim()
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority
    return params
  }, [filters])

  const { data: tasks, isLoading } = useTaskList(queryParams)

  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask(editingTask?._id ?? null)
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { mutateAsync: updateStatus } = useUpdateTaskStatus()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const stats = useMemo(() => {
    if (!tasks) return { upcoming: 0, inProgress: 0, completed: 0 }
    return {
      upcoming: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Done').length,
    }
  }, [tasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (!tasks) return
    const task = tasks.find((t) => t._id === event.active.id)
    if (task) setActiveDrag(task)
  }, [tasks])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveDrag(null)
    const { active, over } = event
    if (!over || !active) return
    const taskId = active.id as string
    const validStatuses: TaskStatus[] = ['To Do', 'In Progress', 'Editing', 'Done']
    let newStatus: TaskStatus | null = null
    if (validStatuses.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus
    } else {
      const overTask = tasks?.find((t) => t._id === over.id)
      if (overTask) newStatus = overTask.status
    }
    if (!newStatus) return
    const oldTask = tasks?.find((t) => t._id === taskId)
    if (!oldTask || oldTask.status === newStatus) return
    try { await updateStatus({ taskId, status: newStatus }); toast.success(t('dashboard.taskUpdated')) }
    catch { toast.error(t('app.error')) }
  }, [updateStatus, tasks, t])

  const handleCreate = useCallback(async (values: TaskFormValues & { media?: string[] }) => {
    try { await createTask(values as TaskFormValues); toast.success(t('dashboard.taskCreated')) }
    catch { toast.error(t('app.error')) }
  }, [createTask, t])

  const handleUpdate = useCallback(async (values: TaskFormValues & { media?: string[] }) => {
    if (!editingTask) return
    try { await updateTask(values as TaskFormValues); setEditingTask(null); toast.success(t('dashboard.taskUpdated')) }
    catch { toast.error(t('app.error')) }
  }, [updateTask, editingTask, t])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try { await deleteTask(deleteTarget); setDeleteTarget(null); toast.success(t('dashboard.taskDeleted')) }
    catch { toast.error(t('app.error')) }
  }, [deleteTask, deleteTarget, t])

  const saving = isCreating || isUpdating

  return (
    <AppLayout tasks={tasks}>
      {/* Page Header */}
      <div className="page-header-wrap animate-in">
        <div>
          <h1>{t('dashboard.title')} Summary</h1>
          <p>{t('dashboard.subtitle', 'Add new project and manage all project')}</p>
        </div>
        <button className="button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          + {t('dashboard.addTask')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row animate-up">
        <div className="stat-card stat-card--orange">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.upcoming', 'Upcoming')}</span>
            <span className="stat-card-number">{stats.upcoming}</span>
          </div>
          <div className="stat-card-icon">📄</div>
          <span className="stat-card-arrow">→</span>
        </div>
        <div className="stat-card stat-card--purple">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.inProgress')}</span>
            <span className="stat-card-number">{stats.inProgress}</span>
          </div>
          <div className="stat-card-icon">✏️</div>
          <span className="stat-card-arrow">→</span>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card-left">
            <span className="stat-card-label">{t('dashboard.completed', 'Completed')}</span>
            <span className="stat-card-number">{stats.completed}</span>
          </div>
          <div className="stat-card-icon">✓</div>
          <span className="stat-card-arrow">→</span>
        </div>
      </div>

      {/* Task Form */}
      <TaskForm
        key={editingTask?._id ?? 'new'}
        defaultValues={editingTask ? {
          title: editingTask.title, description: editingTask.description,
          status: editingTask.status, priority: editingTask.priority,
          dueDate: new Date(editingTask.dueDate).toISOString().split('T')[0],
          media: editingTask.media,
        } : undefined}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancel={() => setEditingTask(null)}
        saving={saving}
        isEditing={Boolean(editingTask)}
      />

      {/* Filters */}
      <TaskFilters onChange={setFilters} />

      {/* Kanban Board */}
      {isLoading ? (
        <div className="kanban-board">
          {[1, 2, 3, 4].map((c) => (
            <div key={c} className="kanban-col">
              <div className="kanban-col-header"><span className="skeleton-line" style={{ width: '60%', height: 14 }} /></div>
              <div className="kanban-col-body">
                {[1, 2].map((r) => <div key={r} className="skeleton-card" />)}
              </div>
            </div>
          ))}
        </div>
      ) : tasks && tasks.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <KanbanBoard tasks={tasks} onEdit={setEditingTask} onDelete={setDeleteTarget} />
          <DragOverlay>
            {activeDrag ? <KanbanCard task={activeDrag} onEdit={() => {}} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="card empty-state animate-in" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>{t('dashboard.noTasks')}</h3>
          <p>{t('dashboard.noTasksDesc')}</p>
        </div>
      )}

      {/* Timeline */}
      {tasks && tasks.length > 0 && (
        <div className="timeline-wrap animate-in">
          <div className="section-header">
            <h2>{t('dashboard.timeline', 'Timeline')}</h2>
          </div>
          <div className="timeline-months">
            {['July', 'August', 'September'].map((m, i) => (
              <div key={m} className={`timeline-month${i === 1 ? ' active' : ''}`}>{m}</div>
            ))}
          </div>
          <div className="timeline-bars">
            {tasks.slice(0, 4).map((task, i) => {
              const colors = ['orange', 'purple', 'blue', 'pink']
              const members = task.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
              return (
                <div key={task._id} className="timeline-bar-wrap" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="timeline-bar-label">{task.title.slice(0, 16)}{task.title.length > 16 ? '...' : ''}</span>
                  <div className={`timeline-bar timeline-bar--${colors[i]}`}>
                    <span>{task.status}</span>
                    <div className="timeline-bar-avatars">
                      <div className="timeline-bar-avatar" style={{ background: ['#FF8A4C','#8A4DFF','#4F6BFF','#FF6B9D'][i] }}>{members}</div>
                      <div className="timeline-bar-avatar" style={{ background: ['#FFB084','#B084FF','#7B8FFF','#FF9DBD'][i] }}>JD</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={t('dashboard.deleteTitle')}
        message={t('dashboard.deleteConfirm')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </AppLayout>
  )
}

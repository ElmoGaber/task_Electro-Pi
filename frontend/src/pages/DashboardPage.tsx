import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import type { Task } from '@/types'
import { TaskForm } from '@/components/TaskForm'
import { TaskFilters } from '@/components/TaskFilters'
import { KanbanBoard } from '@/components/KanbanBoard'
import { KanbanCard } from '@/components/KanbanCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ExportMenu } from '@/components/ExportMenu'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SettingsBar } from '@/components/SettingsBar'
import { useAuth } from '@/context/useAuth'
import { useTheme } from '@/context/useTheme'
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask, useUpdateTaskStatus } from '@/hooks/useTasks'
import type { TaskFiltersState, TaskFormValues } from '@/types'

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
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

  const { data: tasks, isLoading, error } = useTaskList(queryParams)
  const hasFilters = Boolean(filters.search || filters.status || filters.priority)

  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask(editingTask?._id ?? null)
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask()
  const { mutateAsync: updateStatus } = useUpdateTaskStatus()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

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
    const newStatus = over.id as Task['status']
    const validStatuses: Task['status'][] = ['To Do', 'In Progress', 'Done']
    if (!validStatuses.includes(newStatus)) return
    const oldTask = tasks?.find((t) => t._id === taskId)
    if (!oldTask || oldTask.status === newStatus) return
    try {
      await updateStatus({ taskId, status: newStatus })
      toast.success(t('dashboard.taskUpdated'))
    } catch { toast.error(t('app.error')) }
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

  const handleEdit = useCallback((task: Task) => { setEditingTask(task); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const handleCancelEdit = useCallback(() => setEditingTask(null), [])

  const saving = isCreating || isUpdating

  return (
    <main className="container">
      <header className="page-header">
        <div className="page-header-left">
          <h1>{t('dashboard.title')}</h1>
          <span className="subtle">{t('app.welcome', { name: user?.name || 'User' })}</span>
        </div>
        <div className="actions">
          <LanguageToggle />
          <SettingsBar />
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
          </button>
          <button className="button button-ghost button-sm" type="button" onClick={() => navigate('/tasks')}>
            {t('dashboard.tasks')}
          </button>
          <button className="button button-ghost button-sm" type="button" onClick={() => navigate('/analytics')}>
            {t('dashboard.analytics')}
          </button>
          <ExportMenu tasks={tasks} />
          <button className="button button-secondary button-sm" type="button" onClick={logout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      <TaskForm
        key={editingTask?._id ?? 'new'}
        defaultValues={editingTask ? {
          title: editingTask.title, description: editingTask.description,
          status: editingTask.status, priority: editingTask.priority,
          dueDate: new Date(editingTask.dueDate).toISOString().split('T')[0],
          media: editingTask.media,
        } : undefined}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancel={handleCancelEdit}
        saving={saving}
        isEditing={Boolean(editingTask)}
      />

      <TaskFilters onChange={setFilters} />

      {isLoading ? (
        <div className="kanban-board">
          {[1, 2, 3].map((c) => (
            <div key={c} className="kanban-col">
              <div className="kanban-col-header"><span className="skeleton-line" style={{ width: '60%' }} /></div>
              <div className="kanban-col-body">
                {[1, 2].map((r) => <div key={r} className="skeleton-card" />)}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card feedback error-box" role="alert">{error.message}</div>
      ) : tasks && tasks.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <KanbanBoard tasks={tasks} onEdit={handleEdit} onDelete={setDeleteTarget} />
          <DragOverlay>
            {activeDrag ? <KanbanCard task={activeDrag} onEdit={() => {}} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="card empty-state animate-in">
          <svg className="empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="20" width="56" height="48" rx="6" fill="var(--border)" />
            <rect x="20" y="30" width="30" height="4" rx="2" fill="var(--text-tertiary)" />
            <rect x="20" y="40" width="40" height="4" rx="2" fill="var(--text-tertiary)" />
            <circle cx="60" cy="56" r="16" fill="var(--primary-bg)" />
            <path d="M60 48v16M52 56h16" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h3>{hasFilters ? t('dashboard.noMatch') : t('dashboard.noTasks')}</h3>
          <p>{hasFilters ? t('dashboard.noMatchDesc') : t('dashboard.noTasksDesc')}</p>
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
    </main>
  )
}

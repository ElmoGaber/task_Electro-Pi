import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { TaskForm } from '@/components/TaskForm'
import { TaskFilters } from '@/components/TaskFilters'
import { TaskList } from '@/components/TaskList'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ExportMenu } from '@/components/ExportMenu'
import { LanguageToggle } from '@/components/LanguageToggle'
import { SettingsBar } from '@/components/SettingsBar'
import { useAuth } from '@/context/useAuth'
import { useTheme } from '@/context/useTheme'
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask } from '@/hooks/useTasks'
import type { Task, TaskFiltersState, TaskFormValues } from '@/types'

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFiltersState>({ search: '', status: '', priority: '' })

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

  const stats = useMemo(() => {
    if (!tasks) return null
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    }
  }, [tasks])

  const handleCreate = useCallback(async (values: TaskFormValues) => {
    try { await createTask(values); toast.success(t('dashboard.taskCreated')) }
    catch { toast.error(t('app.error')) }
  }, [createTask, t])

  const handleUpdate = useCallback(async (values: TaskFormValues) => {
    if (!editingTask) return
    try { await updateTask(values); setEditingTask(null); toast.success(t('dashboard.taskUpdated')) }
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
          <button className="button button-secondary button-sm" type="button" onClick={logout}>
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      {stats && !isLoading && tasks && tasks.length > 0 && (
        <div className="card animate-in" style={{ padding: '0.9rem 1.1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="live-badge"><span className="live-dot" /> Live</span>
            {stats.total > 0 && <><span className="badge status-to-do">{stats.todo} {t('dashboard.toDo')}</span>
            <span className="badge status-in-progress">{stats.inProgress} {t('dashboard.inProgress')}</span>
            <span className="badge status-done">{stats.done} {t('dashboard.done')}</span></>}
            <ExportMenu tasks={tasks} />
          </div>
        </div>
      )}

      <TaskForm
        key={editingTask?._id ?? 'new'}
        defaultValues={editingTask ? {
          title: editingTask.title, description: editingTask.description,
          status: editingTask.status, priority: editingTask.priority,
          dueDate: new Date(editingTask.dueDate).toISOString().split('T')[0],
        } : undefined}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancel={handleCancelEdit}
        saving={saving}
        isEditing={Boolean(editingTask)}
      />

      <TaskFilters onChange={setFilters} />

      <TaskList
        tasks={tasks} loading={isLoading} error={error} hasFilters={hasFilters}
        onEdit={handleEdit} onDelete={setDeleteTarget}
        onClearFilters={() => setFilters({ search: '', status: '', priority: '' })}
      />

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

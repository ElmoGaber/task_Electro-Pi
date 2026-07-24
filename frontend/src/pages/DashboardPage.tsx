import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { TaskForm } from '@/components/TaskForm'
import { TaskFilters } from '@/components/TaskFilters'
import { TaskList } from '@/components/TaskList'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useAuth } from '@/context/useAuth'
import { useTheme } from '@/context/useTheme'
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask } from '@/hooks/useTasks'
import type { Task, TaskFiltersState, TaskFormValues } from '@/types'

export function DashboardPage() {
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    status: '',
    priority: '',
  })

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

  const handleCreate = useCallback(
    async (values: TaskFormValues) => {
      try {
        await createTask(values)
        toast.success('Task created successfully.')
      } catch {
        toast.error('Failed to create task.')
      }
    },
    [createTask],
  )

  const handleUpdate = useCallback(
    async (values: TaskFormValues) => {
      if (!editingTask) return
      try {
        await updateTask(values)
        setEditingTask(null)
        toast.success('Task updated successfully.')
      } catch {
        toast.error('Failed to update task.')
      }
    },
    [updateTask, editingTask],
  )

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      await deleteTask(deleteTarget)
      setDeleteTarget(null)
      toast.success('Task deleted successfully.')
    } catch {
      toast.error('Failed to delete task.')
    }
  }, [deleteTask, deleteTarget])

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingTask(null)
  }, [])

  const saving = isCreating || isUpdating

  return (
    <main className="container">
      <header className="page-header">
        <div className="page-header-left">
          <h1>TaskFlow</h1>
          <span className="subtle">Welcome back, {user?.name || 'User'}</span>
        </div>
        <div className="actions">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
          </button>
          <button className="button button-secondary" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {stats && !isLoading && tasks && tasks.length > 0 && (
        <div className="card" style={{ padding: '1rem 1.25rem' }}>
          <div className="task-stats">
            <span className="task-stat">
              <span className="task-stat-dot" style={{ background: 'var(--text-secondary)' }} />
              {stats.total} total
            </span>
            <span className="task-stat">
              <span className="task-stat-dot" style={{ background: '#94a3b8' }} />
              {stats.todo} to do
            </span>
            <span className="task-stat">
              <span className="task-stat-dot" style={{ background: '#3b82f6' }} />
              {stats.inProgress} in progress
            </span>
            <span className="task-stat">
              <span className="task-stat-dot" style={{ background: '#22c55e' }} />
              {stats.done} done
            </span>
          </div>
        </div>
      )}

      <TaskForm
        key={editingTask?._id ?? 'new'}
        defaultValues={
          editingTask
            ? {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: new Date(editingTask.dueDate).toISOString().split('T')[0],
              }
            : undefined
        }
        onSubmit={editingTask ? handleUpdate : handleCreate}
        onCancel={handleCancelEdit}
        saving={saving}
        isEditing={Boolean(editingTask)}
      />

      <TaskFilters onChange={setFilters} />

      <TaskList
        tasks={tasks}
        loading={isLoading}
        error={error}
        hasFilters={hasFilters}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onClearFilters={() => setFilters({ search: '', status: '', priority: '' })}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={isDeleting}
      />
    </main>
  )
}

import { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import type { Task, TaskFiltersState } from '@/types'
import { AppLayout } from '@/components/AppLayout'
import { TaskFilters } from '@/components/TaskFilters'
import { TaskForm } from '@/components/TaskForm'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ExportMenu } from '@/components/ExportMenu'
import { TasksGridView } from '@/components/TasksGridView'
import { useCreateTask, useDeleteTask, useTaskList, useUpdateTask } from '@/hooks/useTasks'
import type { TaskFormValues } from '@/types'

export function TasksPage() {
  const { t } = useTranslation()
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

  const { data: tasks, isLoading, error } = useTaskList({ ...queryParams, limit: '100' })
  const hasFilters = Boolean(filters.search || filters.status || filters.priority)

  const { mutateAsync: createTask, isPending: isCreating } = useCreateTask()
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask(editingTask?._id ?? null)
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask()

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
      <div className="page-header-wrap">
        <div>
          <h1>{t('tasks.title')}</h1>
          <p>{t('tasks.subtitle')}</p>
        </div>
        <ExportMenu tasks={tasks} />
      </div>

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

      <TaskFilters onChange={setFilters} />

      <TasksGridView
        tasks={tasks} loading={isLoading} error={error} hasFilters={hasFilters}
        onEdit={setEditingTask} onDelete={setDeleteTarget}
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
    </AppLayout>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from './Spinner'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants'
import type { TaskFormValues } from '@/types'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(120, 'Title must be up to 120 characters.'),
  description: z
    .string()
    .min(1, 'Description is required.')
    .max(1000, 'Description must be up to 1000 characters.'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().min(1, 'Due date is required.'),
})

interface TaskFormProps {
  defaultValues?: TaskFormValues
  onSubmit: (values: TaskFormValues) => void
  onCancel?: () => void
  saving: boolean
  isEditing: boolean
}

const emptyDefaults: TaskFormValues = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  dueDate: '',
}

export function TaskForm({ defaultValues, onSubmit, onCancel, saving, isEditing }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ?? emptyDefaults,
    values: defaultValues,
  })

  const handleCancel = () => {
    reset()
    onCancel?.()
  }

  return (
    <form className="card task-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>{isEditing ? 'Update Task' : 'Create Task'}</h2>

      <label className="field">
        <span>Title</span>
        <input {...register('title')} />
        {errors.title && <small className="error">{errors.title.message}</small>}
      </label>

      <label className="field">
        <span>Description</span>
        <textarea rows={4} {...register('description')} />
        {errors.description && <small className="error">{errors.description.message}</small>}
      </label>

      <div className="grid-2">
        <label className="field">
          <span>Status</span>
          <select {...register('status')}>
            {TASK_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errors.status && <small className="error">{errors.status.message}</small>}
        </label>

        <label className="field">
          <span>Priority</span>
          <select {...register('priority')}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {errors.priority && <small className="error">{errors.priority.message}</small>}
        </label>
      </div>

      <label className="field">
        <span>Due Date</span>
        <input type="date" {...register('dueDate')} />
        {errors.dueDate && <small className="error">{errors.dueDate.message}</small>}
      </label>

      <div className="actions">
        <button className="button" type="submit" disabled={saving}>
          {saving && <Spinner />}
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Task'}
        </button>
        {isEditing && (
          <button className="button button-secondary" type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

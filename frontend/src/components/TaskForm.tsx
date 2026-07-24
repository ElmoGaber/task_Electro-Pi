import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Spinner } from './Spinner'
import { VoiceRecorder } from './VoiceRecorder'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants'
import type { TaskFormValues } from '@/types'
import api from '@/api/client'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.').max(120, 'Title must be up to 120 characters.'),
  description: z.string().min(1, 'Description is required.').max(1000, 'Description must be up to 1000 characters.'),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: z.string().min(1, 'Due date is required.'),
})

interface TaskFormProps {
  defaultValues?: TaskFormValues & { media?: string[] }
  onSubmit: (values: TaskFormValues & { media?: string[] }) => void
  onCancel?: () => void
  saving: boolean
  isEditing: boolean
}

const emptyDefaults: TaskFormValues = {
  title: '', description: '', status: 'To Do', priority: 'Medium', dueDate: '',
}

export function TaskForm({ defaultValues, onSubmit, onCancel, saving, isEditing }: TaskFormProps) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<string[]>(defaultValues?.media ?? [])
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema), defaultValues: defaultValues ?? emptyDefaults, values: defaultValues,
  })

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post<{ url: string }>('/upload', form)
      setMedia((prev) => [...prev, data.url])
    } catch {
      // upload failed
    } finally { setUploading(false) }
  }, [])

  const handleVoice = useCallback(async (blob: Blob) => {
    const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' })
    await handleUpload(file)
  }, [handleUpload])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const removeMedia = useCallback((url: string) => {
    setMedia((prev) => prev.filter((m) => m !== url))
  }, [])

  const handleCancel = () => { reset({ media: [] }); setMedia([]); onCancel?.() }

  return (
    <form className="card task-form animate-scale" onSubmit={handleSubmit((vals) => onSubmit({ ...vals, media }))} noValidate>
      <h2>{isEditing ? t('dashboard.updateTask') : t('dashboard.createTask')}</h2>

      <label className="field">
        <span>{t('dashboard.title', 'Title')}</span>
        <input {...register('title')} />
        {errors.title && <small className="error">{errors.title.message}</small>}
      </label>

      <label className="field">
        <span>{t('dashboard.description', 'Description')}</span>
        <textarea rows={4} {...register('description')} />
        {errors.description && <small className="error">{errors.description.message}</small>}
      </label>

      <div className="grid-2">
        <label className="field">
          <span>{t('dashboard.status')}</span>
          <select {...register('status')}>
            {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{t('dashboard.priority')}</span>
          <select {...register('priority')}>
            {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <label className="field">
        <span>{t('dashboard.dueDate')}</span>
        <input type="date" {...register('dueDate')} />
        {errors.dueDate && <small className="error">{errors.dueDate.message}</small>}
      </label>

      <div className="field">
        <span>{t('task.media', 'Media')}</span>
        <div className="media-actions">
          <label className="button button-secondary button-sm">
            {uploading ? <Spinner /> : '\u{1F5BC}'} {t('task.addImage', 'Image')}
            <input type="file" accept="image/*" onChange={handleImageSelect} hidden />
          </label>
          <VoiceRecorder onRecorded={handleVoice} />
        </div>
        {media.length > 0 && (
          <div className="media-previews">
            {media.map((url, i) => (
              <div key={i} className="media-preview-item">
                {url.match(/\.(mp3|wav|ogg|webm)$/i)
                  ? <audio src={url} controls className="media-audio" />
                  : <img src={url} alt="" className="media-thumb" />}
                <button type="button" className="media-remove" onClick={() => removeMedia(url)}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <button className="button" type="submit" disabled={saving || uploading}>
          {saving && <Spinner />}
          {saving ? t('dashboard.saving') : isEditing ? t('dashboard.saveChanges') : t('dashboard.addTask')}
        </button>
        {isEditing && (
          <button className="button button-secondary" type="button" onClick={handleCancel}>
            {t('dashboard.cancel')}
          </button>
        )}
      </div>
    </form>
  )
}

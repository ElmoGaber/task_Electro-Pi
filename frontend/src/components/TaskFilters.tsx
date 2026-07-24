import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDebounce } from '@/hooks/useDebounce'
import type { TaskFiltersState } from '@/types'

function parseParams(searchParams: URLSearchParams): TaskFiltersState {
  return {
    search: searchParams.get('search') ?? '',
    status: searchParams.get('status') ?? '',
    priority: searchParams.get('priority') ?? '',
  }
}

interface TaskFiltersProps {
  onChange: (filters: TaskFiltersState) => void
}

export function TaskFilters({ onChange }: TaskFiltersProps) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [rawSearch, setRawSearch] = useState(() => parseParams(searchParams).search)
  const [status, setStatus] = useState(() => parseParams(searchParams).status)
  const [priority, setPriority] = useState(() => parseParams(searchParams).priority)
  const debouncedSearch = useDebounce(rawSearch, 300)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim())
    setSearchParams(params, { replace: true })
    onChangeRef.current({ search: debouncedSearch, status, priority })
  }, [debouncedSearch, status, priority, setSearchParams])

  const handleClear = useCallback(() => {
    setRawSearch('')
    setStatus('')
    setPriority('')
    setSearchParams({}, { replace: true })
    onChangeRef.current({ search: '', status: '', priority: '' })
  }, [setSearchParams])

  return (
    <div className="card filters">
      <h2 style={{ margin: '0 0 0.85rem', fontSize: '1rem', fontWeight: 600 }}>{t('dashboard.searchFilter')}</h2>
      <div className="filters-grid">
        <label className="field">
          <span>{t('dashboard.title', 'Title')}</span>
          <input placeholder={t('dashboard.searchPlaceholder')} name="search" value={rawSearch} onChange={(e) => setRawSearch(e.target.value)} />
        </label>
        <label className="field">
          <span>{t('dashboard.status')}</span>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t('dashboard.all')}</option>
            <option value="To Do">{t('status.To Do')}</option>
            <option value="In Progress">{t('status.In Progress')}</option>
            <option value="Done">{t('status.Done')}</option>
          </select>
        </label>
        <label className="field">
          <span>{t('dashboard.priority')}</span>
          <select name="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">{t('dashboard.all')}</option>
            <option value="Low">{t('priority.Low')}</option>
            <option value="Medium">{t('priority.Medium')}</option>
            <option value="High">{t('priority.High')}</option>
          </select>
        </label>
      </div>
      <button className="button button-secondary" type="button" onClick={handleClear}>
        {t('dashboard.clearFilters')}
      </button>
    </div>
  )
}

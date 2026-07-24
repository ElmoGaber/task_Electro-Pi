import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
      <h2 style={{ margin: '0 0 0.85rem', fontSize: '1rem', fontWeight: 600 }}>Search & Filter</h2>
      <div className="filters-grid">
        <label className="field">
          <span>Title</span>
          <input
            placeholder="Search title..."
            name="search"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <label className="field">
          <span>Priority</span>
          <select name="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>
      <button className="button button-secondary" type="button" onClick={handleClear}>
        Clear Filters
      </button>
    </div>
  )
}

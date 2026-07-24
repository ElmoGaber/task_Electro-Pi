import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface TopNavProps {
  onSearchClick?: () => void
  onSearch?: (query: string) => void
  searchValue?: string
}

export function TopNav({ onSearchClick, onSearch, searchValue }: TopNavProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="topnav-search" onClick={onSearchClick} style={{ cursor: 'pointer' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('nav.searchPlaceholder', 'Search anything...  (⌘K)')}
            value={searchValue ?? ''}
            onChange={(e) => onSearch?.(e.target.value)}
            onFocus={(e) => { e.target.blur(); onSearchClick?.() }}
            readOnly
          />
          <span className="search-shortcut-hint">⌘K</span>
        </div>
      </div>
      <div className="topnav-right">
        <button className="topnav-icon-btn" type="button" onClick={() => navigate('/notifications')}>
          🔔
          <span className="topnav-badge">3</span>
        </button>
      </div>
    </header>
  )
}

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface TopNavProps {
  onSearch?: (query: string) => void
  searchValue?: string
}

export function TopNav({ onSearch, searchValue }: TopNavProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="topnav-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('nav.searchPlaceholder', 'Search something here...')}
            value={searchValue ?? ''}
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>
      <div className="topnav-right">
        <button className="topnav-icon-btn" type="button" onClick={() => navigate('/analytics')}>
          📊
        </button>
        <button className="topnav-icon-btn" type="button">
          🔔
          <span className="topnav-badge">3</span>
        </button>
      </div>
    </header>
  )
}

import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/useAuth'
import { useTheme } from '@/context/useTheme'

interface NavItem {
  icon: string
  label: string
  path: string
  badge?: number
}

const NAV_ITEMS: NavItem[] = [
  { icon: '⊞', label: 'Overview', path: '/' },
  { icon: '▤', label: 'Projects', path: '/projects' },
  { icon: '⏱', label: 'Activity', path: '/activity', badge: 3 },
  { icon: '✉', label: 'Messages', path: '/messages', badge: 5 },
  { icon: '👥', label: 'Members', path: '/members' },
  { icon: '📅', label: 'Calendar', path: '/calendar' },
  { icon: '📊', label: 'Analytics', path: '/analytics' },
  { icon: '⚙', label: 'Settings', path: '/settings' },
]

interface SidebarProps {
  collapsed?: boolean
  onClose?: () => void
}

export function Sidebar({ collapsed, onClose }: SidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()

  const handleNav = (path: string) => {
    navigate(path)
    onClose?.()
  }

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <div className="layer layer-1" />
          <div className="layer layer-2" />
        </div>
        <span className="sidebar-logo-text">TASK</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
          return (
            <div
              key={item.path}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{t(`nav.${item.label.toLowerCase()}`, item.label)}</span>
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </div>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-theme-toggle">
          <span>{t('settings.darkMode', 'Dark Mode')}</span>
          <button
            className={`theme-switch${theme === 'dark' ? ' active' : ''}`}
            onClick={toggleTheme}
            aria-label="Toggle theme"
            type="button"
          >
            <span className="theme-switch-knob">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name ?? 'User'}</div>
            <div className="sidebar-user-role">{user?.role === 'admin' ? 'Admin' : 'Manager'}</div>
          </div>
          <button className="button-ghost" style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }} onClick={logout} type="button">↩</button>
        </div>
      </div>
    </aside>
  )
}

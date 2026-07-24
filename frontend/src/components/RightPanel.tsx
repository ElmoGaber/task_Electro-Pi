import { useTranslation } from 'react-i18next'
import type { Task } from '@/types'

interface RightPanelProps {
  tasks: Task[] | undefined
}

const COLORS = ['#4F6BFF', '#8A4DFF', '#FF8A4C', '#4DD8FF', '#FF6B9D', '#4CD964']

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const MESSAGES = [
  { name: 'Brooklyn Simmons', preview: 'Hey! How are you?', time: '2m', badge: 2, color: '#4F6BFF' },
  { name: 'Marvin McKinney', preview: 'The project is ready...', time: '15m', badge: 0, color: '#8A4DFF' },
  { name: 'Leslie Alexander', preview: 'Please review the...', time: '1h', badge: 3, color: '#FF8A4C' },
  { name: 'Jacob Jones', preview: 'Can we schedule a...', time: '3h', badge: 0, color: '#4DD8FF' },
  { name: 'Arlene McCoy', preview: 'Updates are live! 🎉', time: '5h', badge: 0, color: '#FF6B9D' },
]

const TEAM_MEMBERS = [
  { name: 'Robert Fox', color: '#4F6BFF' },
  { name: 'Jenny Wilson', color: '#8A4DFF' },
  { name: 'Esther Howard', color: '#FF8A4C' },
  { name: 'Cody Fisher', color: '#4DD8FF' },
  { name: 'Leslie Alexander', color: '#FF6B9D' },
  { name: '', color: '' },
]

const TODAY_TASKS = [
  { title: 'Wireframes', desc: 'Create wireframes for the dashboard', time: '09:00 - 11:00', participants: ['RF', 'JW'] },
  { title: 'UI Design', desc: 'Finalize the UI components', time: '11:00 - 13:00', participants: ['EH', 'CF'] },
  { title: 'Backend API', desc: 'Connect endpoints', time: '14:00 - 16:00', participants: ['RF'] },
]

export function RightPanel(_props: RightPanelProps) {
  const { t } = useTranslation()

  return (
    <aside className="right-panel">
      {/* Recent Messages */}
      <div>
        <div className="section-header">
          <h2>{t('panel.messages', 'Recent Messages')}</h2>
          <span className="see-all">{t('panel.seeAll', 'See All')}</span>
        </div>
        <div className="messages-list">
          {MESSAGES.map((msg, i) => (
            <div key={i} className="message-item">
              <div className="message-avatar" style={{ background: msg.color }}>{getInitials(msg.name)}</div>
              <div className="message-content">
                <div className="message-name">{msg.name}</div>
                <div className="message-preview">{msg.preview}</div>
              </div>
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                {msg.badge > 0 && <span className="message-badge">{msg.badge}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div>
        <div className="section-header">
          <h2>{t('panel.team', 'Team Members')}</h2>
          <span className="see-all">{t('panel.seeAll', 'See All')}</span>
        </div>
        <div className="team-avatars">
          {TEAM_MEMBERS.map((m, i) => (
            m.name ? (
              <div key={i} className="team-avatar" style={{ background: m.color }} title={m.name}>
                {getInitials(m.name)}
              </div>
            ) : (
              <div key={i} className="team-avatar team-avatar--more">+2</div>
            )
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <div>
        <div className="section-header">
          <h2>{t('panel.today', "Today's Tasks")}</h2>
        </div>
        <div className="today-list">
          {TODAY_TASKS.map((task, i) => (
            <div key={i} className="today-item">
              <button className={`today-check${i === 2 ? ' checked' : ''}`} type="button">
                {i === 2 && <span className="today-check-inner">✓</span>}
              </button>
              <div className="today-item-content">
                <div className="today-item-title">{task.title}</div>
                <div className="today-item-desc">{task.desc}</div>
                <div className="today-item-time">🕐 {task.time}</div>
                <div className="today-item-participants">
                  {task.participants.map((p, j) => (
                    <div key={j} className="today-participant" style={{ background: COLORS[j] }}>{p}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

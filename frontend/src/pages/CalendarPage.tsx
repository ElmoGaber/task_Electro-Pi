import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { CreateEventModal } from '@/components/CreateEventModal'
import { fakeEvents, genId } from '@/lib/fakeData'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function CalendarPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [view, setView] = useState<'month' | 'week'>('month')
  const [events, setEvents] = useState(fakeEvents)
  const [showEventModal, setShowEventModal] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2000) }

  const handleCreateEvent = (data: { title: string; date: string; start: string; end: string; color: string; description: string; location: string }) => {
    const newEvent = {
      id: genId(), title: data.title, date: data.date, start: data.start, end: data.end,
      color: data.color, recurring: false, description: data.description,
      location: data.location || undefined,
    }
    setEvents((prev) => [...prev, newEvent])
    showToast(`📅 Event "${data.title}" created!`)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof events> = {}
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : []
  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const navigate = (dir: number) => {
    let m = month + dir
    let y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m); setYear(y)
  }

  const renderDays = () => {
    const cells: React.ReactNode[] = []
    // Previous month days
    for (let p = firstDay - 1; p >= 0; p--) {
      cells.push(<div key={`prev-${p}`} className="calendar-cell calendar-cell--empty"><span className="calendar-date calendar-date--muted">{prevDays - p}</span></div>)
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayEvents = eventsByDate[dateStr] || []
      const isToday = dateStr === todayStr
      const isSelected = dateStr === selectedDate
      const dotColors = dayEvents.slice(0, 3).map((e) => e.color)
      cells.push(
        <div key={d} className={`calendar-cell ${isToday ? 'calendar-cell--today' : ''} ${isSelected ? 'calendar-cell--selected' : ''} ${dayEvents.length > 0 ? 'calendar-cell--has-events' : ''}`} onClick={() => setSelectedDate(dateStr)}>
          <span className="calendar-date">{d}</span>
          {dotColors.length > 0 && <div className="calendar-dots">{dotColors.map((c, i) => <span key={i} className="calendar-dot" style={{ background: c }} />)}</div>}
          <div className="calendar-event-titles">{dayEvents.slice(0, 2).map((e) => <span key={e.id} className="calendar-event-title">{e.title}</span>)}</div>
        </div>
      )
    }
    return cells
  }

  return (
    <AppLayout>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {toast && <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--primary)', color: '#fff', padding: '0.75rem 1.2rem', borderRadius: 'var(--radius)', zIndex: 500, fontSize: '0.85rem', boxShadow: 'var(--shadow-lg)' }}>{toast}</div>}
      <div className="page-header-wrap">
        <div><h1>Calendar</h1><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{events.length} scheduled events</p></div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="button button-secondary button-sm" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDate(null) }}>Today</button>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            <button className="button button-secondary button-sm" onClick={() => navigate(-1)}>‹</button>
            <button className="button button-secondary button-sm" onClick={() => navigate(1)}>›</button>
          </div>
          <button className="button" style={{ borderRadius: 8 }} onClick={() => setShowEventModal(true)}>+ New Event</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{months[month]} {year}</h2>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
          <button className={`button ${view === 'month' ? '' : 'button-secondary'} button-sm`} onClick={() => setView('month')}>Month</button>
          <button className={`button ${view === 'week' ? '' : 'button-secondary'} button-sm`} onClick={() => setView('week')}>Week</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedEvents.length > 0 ? '1fr 280px' : '1fr', gap: '1rem' }}>
        <div>
          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {days.map((d) => <div key={d} style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', background: 'var(--bg-card)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>)}
            {renderDays()}
          </div>
        </div>

        {/* Events panel */}
        {selectedEvents.length > 0 && (
          <div>
            <div className="card">
              <div className="section-header"><h3>Events</h3></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>{selectedDate}</div>
              {selectedEvents.map((e) => (
                <div key={e.id} style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', marginBottom: '0.4rem' }}>
                  <div style={{ width: 3, height: 'auto', borderRadius: 2, background: e.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{e.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{e.start} - {e.end}{e.recurring ? ' (recurring)' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <CreateEventModal open={showEventModal} onClose={() => setShowEventModal(false)} onSubmit={handleCreateEvent} />
    </motion.div>
    </AppLayout>
  )
}

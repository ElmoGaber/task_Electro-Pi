import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CreateEventModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { title: string; date: string; start: string; end: string; color: string; description: string; location: string }) => void
}

const colors = ['#4F7CFF','#8A4DFF','#FF8A4C','#22C55E','#F59E0B','#EF4444','#FF6B9D','#4DD8FF']

export function CreateEventModal({ open, onClose, onSubmit }: CreateEventModalProps) {
  const now = new Date()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(now.toISOString().split('T')[0])
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')
  const [color, setColor] = useState(colors[0])
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title, date, start, end, color, description, location })
    setTitle(''); setDescription(''); setLocation('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }} className="card"
            style={{ width: 440, maxWidth: '90vw', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>New Event</h2>
              <button className="button-icon" onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Event Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sprint Planning" required
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Start</label>
                  <input type="time" value={start} onChange={(e) => setStart(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>End</label>
                  <input type="time" value={end} onChange={(e) => setEnd(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {colors.map((c) => (
                    <div key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid var(--text)' : '2px solid transparent' }} />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event description..."
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Room A / Zoom link"
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="button">Create Event</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

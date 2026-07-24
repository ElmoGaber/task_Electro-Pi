import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description: string
    status: string
    priority: string
    deadline: string
    owner: string
    image: string
    color: string
  }) => void
}

const colors = ['#4F7CFF','#8A4DFF','#FF8A4C','#22C55E','#F59E0B','#EF4444','#FF6B9D','#4DD8FF','#A78BFA','#34D399']

export function ProjectModal({ open, onClose, onSubmit }: ProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('In Progress')
  const [priority, setPriority] = useState('Medium')
  const [deadline, setDeadline] = useState('')
  const [owner, setOwner] = useState('')
  const [image, setImage] = useState('')
  const [color, setColor] = useState(colors[0])
  const [preview, setPreview] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setPreview(reader.result as string); setImage(file.name) }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name, description, status, priority, deadline: deadline || new Date().toISOString().split('T')[0], owner: owner || 'You', image: image || name.slice(0, 2).toUpperCase(), color })
    setName(''); setDescription(''); setStatus('In Progress'); setPriority('Medium'); setDeadline(''); setOwner(''); setImage(''); setPreview(''); setColor(colors[0])
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
            style={{ width: 520, maxWidth: '90vw', maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>New Project</h2>
              <button className="button-icon" onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Project Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Project" required
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description..." rows={3}
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <option>In Progress</option><option>Pending</option><option>Completed</option><option>Archived</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Deadline</label>
                  <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Owner</label>
                  <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="Your name"
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Cover Color</label>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {colors.map((c) => (
                    <div key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', border: color === c ? '2px solid var(--text)' : '2px solid transparent', transition: 'border 0.15s' }} />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Cover Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                  <button type="button" className="button button-secondary button-sm" onClick={() => fileRef.current?.click()}>Upload Image</button>
                  {preview && <img src={preview} alt="Preview" style={{ width: 48, height: 48, borderRadius: 'var(--radius)', objectFit: 'cover' }} />}
                  {image && !preview && <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{image}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="button">Create Project</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

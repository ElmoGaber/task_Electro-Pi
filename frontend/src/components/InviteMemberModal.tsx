import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; email: string; role: string; department: string }) => void
}

export function InviteMemberModal({ open, onClose, onSubmit }: InviteMemberModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [department, setDepartment] = useState('Engineering')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    onSubmit({ name, email, role, department })
    setName(''); setEmail(''); setRole('Developer'); setDepartment('Engineering')
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
            style={{ width: 420, maxWidth: '90vw', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Invite Member</h2>
              <button className="button-icon" onClick={onClose}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" required
                  style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <option>Developer</option><option>Designer</option><option>Manager</option><option>Admin</option><option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }}>
                    <option>Engineering</option><option>Design</option><option>Product</option><option>Marketing</option><option>Support</option><option>Sales</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="button">Send Invite</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

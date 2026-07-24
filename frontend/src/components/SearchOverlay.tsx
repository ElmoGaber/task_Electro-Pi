import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fakeProjects, fakeUsers, fakeMessages } from '@/lib/fakeData'

interface SearchResult {
  id: string; label: string; sub: string; path: string; icon: string; color?: string
}

interface SearchOverlayProps {
  open: boolean; onClose: () => void
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const items: SearchResult[] = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return []
    const results: SearchResult[] = []

    fakeProjects.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).forEach((p) => {
      results.push({ id: `p-${p.id}`, label: p.name, sub: p.description.slice(0, 50), path: '/projects', icon: '▤', color: p.color })
    })
    fakeUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.includes(q) || u.department.toLowerCase().includes(q)).forEach((u) => {
      results.push({ id: `u-${u.id}`, label: u.name, sub: `${u.role} · ${u.department}`, path: '/members', icon: '👤', color: u.color })
    })
    fakeMessages.filter((m) => m.from.toLowerCase().includes(q) || m.text.toLowerCase().includes(q)).forEach((m) => {
      results.push({ id: `m-${m.id}`, label: m.from, sub: m.text, path: '/messages', icon: '✉' })
    })
    return results.slice(0, 12)
  }, [query])

  useEffect(() => { if (open) { setQuery(''); setActiveIdx(0); setTimeout(() => inputRef.current?.focus(), 50) } }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); if (!open) onClose(); else onClose(); return }
      if (!open) return
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, items.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && items[activeIdx]) { e.preventDefault(); handleSelect(items[activeIdx]) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, items, activeIdx])

  const handleSelect = (item: SearchResult) => { navigate(item.path); onClose() }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div className="search-modal" initial={{ scale: 0.96, y: -20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: -20, opacity: 0 }} transition={{ duration: 0.12 }} onClick={(e) => e.stopPropagation()}>
            <div className="search-input-wrap">
              <span className="search-input-icon">🔍</span>
              <input ref={inputRef} className="search-input" placeholder="Search projects, people, messages…" value={query} onChange={(e) => { setQuery(e.target.value); setActiveIdx(0) }} />
              <span className="search-shortcut">⌘K</span>
            </div>
            {query.trim() && (
              <div className="search-results">
                {items.length === 0 ? (
                  <div className="search-empty">No results found for "<strong>{query}</strong>"</div>
                ) : (
                  items.map((item, i) => (
                    <div key={item.id} className={`search-result-item${i === activeIdx ? ' active' : ''}`} onClick={() => handleSelect(item)} onMouseEnter={() => setActiveIdx(i)}>
                      <div className="search-result-icon" style={{ background: item.color ? `${item.color}20` : 'var(--bg-elevated)', color: item.color || 'var(--text)' }}>{item.icon}</div>
                      <div className="search-result-info">
                        <div className="search-result-label">{item.label}</div>
                        <div className="search-result-sub">{item.sub}</div>
                      </div>
                      <span className="search-result-path">{item.path}</span>
                    </div>
                  ))
                )}
              </div>
            )}
            {!query.trim() && (
              <div className="search-hints">
                {[
                  { icon: '▤', label: 'Projects', path: '/projects' },
                  { icon: '👤', label: 'Members', path: '/members' },
                  { icon: '✉', label: 'Messages', path: '/messages' },
                  { icon: '⚙', label: 'Settings', path: '/settings' },
                ].map((h) => (
                  <div key={h.path} className="search-hint-item" onClick={() => { navigate(h.path); onClose() }}>
                    <span className="search-hint-icon">{h.icon}</span>
                    <span>{h.label}</span>
                    <span className="search-hint-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

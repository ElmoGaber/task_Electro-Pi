import { useState, useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppLayout } from '@/components/AppLayout'
import { fakeUsers, fakeMessages } from '@/lib/fakeData'

interface ChatMessage { id: string; from: string; text: string; time: string; isMe: boolean; attachments?: number }

export function MessagesPage() {
  const [activeChat, setActiveChat] = useState(fakeMessages[0]?.id)
  const [search, setSearch] = useState('')
  const [msgText, setMsgText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const conversations = useMemo(() => fakeMessages.filter((m) => m.from.toLowerCase().includes(search.toLowerCase())), [search])

  const activeUser = fakeMessages.find((m) => m.id === activeChat)
  const chatMessages: ChatMessage[] = useMemo(() => {
    if (!activeUser) return []
    const msgs: ChatMessage[] = [
      { id: '1', from: activeUser.from, text: activeUser.text, time: '10:30 AM', isMe: false },
      { id: '2', from: activeUser.from, text: 'Let me know what you think! 🚀', time: '10:31 AM', isMe: false },
      { id: '3', from: 'You', text: 'Looks great! I will review it now.', time: '10:35 AM', isMe: true },
      { id: '4', from: activeUser.from, text: 'Awesome, thanks!', time: '10:36 AM', isMe: false },
      { id: '5', from: 'You', text: 'I left some comments on the PR.', time: '10:40 AM', isMe: true },
      { id: '6', from: activeUser.from, text: 'Got it, will check them out.', time: '10:42 AM', isMe: false },
    ]
    return msgs
  }, [activeUser])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeChat])

  const handleSend = () => {
    if (!msgText.trim()) return
    setMsgText('')
  }

  return (
    <AppLayout showRightPanel={false}>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '0', height: 'calc(100vh - 140px)' }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '0.8rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Messages</h2>
          <input style={{ width: '100%', padding: '0.45rem 0.7rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8rem' }} placeholder="Search conversations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((m) => {
            const u = fakeUsers.find((x) => x.name === m.from)
            const isActive = m.id === activeChat
            return (
              <div key={m.id} onClick={() => setActiveChat(m.id)} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.8rem', cursor: 'pointer',
                borderBottom: '1px solid var(--border)', background: isActive ? 'var(--primary-bg)' : 'transparent', transition: 'all 0.15s',
              }} onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'var(--bg-elevated)')} onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: u?.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>{u?.avatar || '?'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{m.from}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{m.text}</div>
                </div>
                {m.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeUser ? (
          <>
            <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {(() => { const u = fakeUsers.find((x) => x.name === activeUser.from); return (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: u?.color || 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>{u?.avatar || '?'}</div>
              ) })()}
              <div><div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{activeUser.from}</div><div style={{ fontSize: '0.7rem', color: 'var(--green)' }}>Online</div></div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.3rem' }}>
                <button className="button-icon" title="Call">📞</button>
                <button className="button-icon" title="Video">📹</button>
                <button className="button-icon" title="Info">ℹ️</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {chatMessages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isMe ? 'flex-end' : 'flex-start' }}>
                  <div className="chat-bubble" style={{
                    background: msg.isMe ? 'var(--primary)' : 'var(--bg-elevated)', color: msg.isMe ? '#fff' : 'var(--text)', padding: '0.5rem 0.8rem',
                    borderRadius: msg.isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px', maxWidth: '70%', fontSize: '0.85rem',
                  }}>{msg.text}</div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: 2 }}>{msg.time}</span>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <button className="button-icon" title="Attach">📎</button>
              <button className="button-icon" title="Emoji">😊</button>
              <input style={{ flex: 1, padding: '0.55rem 0.8rem', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.85rem' }} placeholder="Type a message..." value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <button className="button" style={{ borderRadius: '50%', width: 38, height: 38, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }} onClick={handleSend}>➤</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)' }}>Select a conversation to start chatting</div>
        )}
      </div>
    </motion.div>
    </AppLayout>
  )
}

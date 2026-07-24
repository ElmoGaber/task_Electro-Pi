import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { fakeProjects } from '@/lib/fakeData'

interface ChatMessage {
  id: string; role: 'user' | 'assistant'; text: string; time: string
  images?: string[]; audio?: string
}

const quickActions = [
  { icon: '📋', label: 'Create Task', action: 'create_task' },
  { icon: '📊', label: 'Project Status', action: 'project_status' },
  { icon: '⏰', label: 'Deadlines', action: 'deadlines' },
  { icon: '📈', label: 'Productivity', action: 'productivity' },
]

const suggestions = [
  'Create a new task for the Finance App',
  'Show me overdue tasks',
  'What is the team working on today?',
  'Schedule a team meeting',
]

const botResponses: Record<string, string> = {
  create_task: "I'll help you create a task. Please provide the task name, project, and priority level.",
  project_status: fakeProjects.slice(0, 5).map((p) => `• **${p.name}** — ${p.progress}% complete (${p.status})`).join('\n'),
  deadlines: fakeProjects.filter((p) => p.status !== 'Completed').slice(0, 5).map((p) => `• **${p.name}** — due ${p.deadline}`).join('\n'),
  productivity: `📊 **Team Productivity**\n• Tasks completed this week: ${Math.floor(Math.random() * 50 + 20)}\n• Avg completion rate: ${Math.floor(Math.random() * 30 + 60)}%\n• Active projects: ${fakeProjects.filter((p) => p.status === 'In Progress').length}`,
}

export function AssistantChat() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', text: "Hello! I'm your AI assistant. I can help you create tasks, check project status, and more. How can I help?", time: 'now' },
  ])
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const [showActions, setShowActions] = useState(true)
  const listRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [open, msgs])

  const addMsg = (role: 'user' | 'assistant', text: string, extra: Partial<ChatMessage> = {}) => {
    const msg: ChatMessage = { id: Date.now().toString(), role, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ...extra }
    setMsgs((prev) => [...prev, msg])
    setShowActions(false)
    return msg
  }

  const handleSend = (text?: string) => {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    addMsg('user', msg)

    setTimeout(() => {
      const lower = msg.toLowerCase()
      let reply = ''

      if (lower.includes('create') || lower.includes('task') || lower.includes('new')) {
        reply = "✅ Task created! I've added it to the **Finance App** project with **High** priority. You can view it in the Projects page."
        addMsg('assistant', reply)
      } else if (lower.includes('overdue') || lower.includes('late')) {
        reply = `⚠️ You have **${fakeProjects.filter((p) => p.status !== 'Completed' && new Date(p.deadline) < new Date()).length}** overdue items:\n` +
          fakeProjects.filter((p) => p.status !== 'Completed' && new Date(p.deadline) < new Date()).slice(0, 3).map((p) => `• ${p.name} (due ${p.deadline})`).join('\n')
        addMsg('assistant', reply)
      } else if (lower.includes('meeting') || lower.includes('schedule')) {
        reply = "📅 I've scheduled a **Sprint Planning** meeting for tomorrow at **10:00 AM**. All team members will be invited."
        addMsg('assistant', reply)
      } else {
        reply = pick(['Good question! Based on current data, the team is making great progress.',
          "I've analyzed the workspace metrics. Everything looks on track for this sprint.",
          "Here's a tip: Breaking down large tasks can improve completion rate by up to 40%.",
          'I see you have several projects in progress. Want me to prepare a status report?',
          'The team has completed 78% of their assigned tasks this sprint. Great productivity!'])
        addMsg('assistant', reply)
      }
    }, 600)
  }

  const handleQuickAction = (action: string) => {
    addMsg('user', quickActions.find((a) => a.action === action)?.label || action)
    setTimeout(() => {
      addMsg('assistant', botResponses[action] || "I'm processing your request. Please hold on.")
    }, 500)
  }

  const handleImageUpload = () => {
    const inputEl = document.createElement('input')
    inputEl.type = 'file'
    inputEl.accept = 'image/*'
    inputEl.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          addMsg('user', '📷 Uploaded an image', { images: [dataUrl] })
          setTimeout(() => addMsg('assistant', "Thanks for the image! I can see it clearly. Would you like me to analyze it or create a task based on it?"), 500)
        }
        reader.readAsDataURL(file)
      }
    }
    inputEl.click()
  }

  const handleVoiceRecord = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop()
      setRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      const chunks: BlobPart[] = []
      mr.ondataavailable = (e) => chunks.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        addMsg('user', '🎤 Recorded a voice message', { audio: url })
        setTimeout(() => addMsg('assistant', "I received your voice message. Let me process it and get back to you shortly."), 800)
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setRecording(true)
    } catch {
      addMsg('assistant', "⚠️ Microphone access denied. Please allow microphone permissions to record voice messages.")
    }
  }

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]

  return (
    <div className={`assistant-wrapper${open ? ' assistant-wrapper--open' : ''}`}>
      <AnimatePresence>
        {open && (
          <motion.div className="assistant-panel" initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.15 }}>
            <div className="assistant-head">
              <span className="assistant-avatar">🤖</span>
              <span className="assistant-title">AI Assistant</span>
              <button type="button" className="assistant-close" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="assistant-body" ref={listRef}>
              {msgs.map((m) => (
                <div key={m.id} className={`chat-msg chat-msg--${m.role}`}>
                  {m.role === 'assistant' && <div className="chat-msg-avatar">🤖</div>}
                  <div className="chat-msg-content">
                    <div className="chat-msg-text" style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                    {m.images?.map((img, i) => <img key={i} src={img} alt="Upload" className="chat-msg-img" />)}
                    {m.audio && <audio src={m.audio} controls className="chat-msg-audio" />}
                    <div className="chat-msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
              {showActions && (
                <div className="assistant-actions">
                  <div className="assistant-actions-label">Quick Actions</div>
                  <div className="assistant-actions-grid">
                    {quickActions.map((a) => (
                      <button key={a.action} className="assistant-action-btn" onClick={() => handleQuickAction(a.action)}>
                        <span>{a.icon}</span> {a.label}
                      </button>
                    ))}
                  </div>
                  <div className="assistant-suggestions">
                    {suggestions.map((s, i) => (
                      <button key={i} className="assistant-suggestion-btn" onClick={() => handleSend(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="assistant-foot">
              <div className="assistant-input-wrap">
                <button className="assistant-media-btn" onClick={handleImageUpload} title="Upload image">📷</button>
                <button className={`assistant-media-btn${recording ? ' assistant-media-btn--recording' : ''}`} onClick={handleVoiceRecord} title={recording ? 'Stop recording' : 'Record voice'}>
                  {recording ? '⏹' : '🎤'}
                </button>
                <input className="assistant-input" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <button className="assistant-send-btn" onClick={() => handleSend()}>➤</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="assistant-fab" type="button" onClick={() => setOpen(!open)}
        aria-label="AI Assistant"
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      >
        {open ? '✕' : '🤖'}
      </motion.button>
    </div>
  )
}

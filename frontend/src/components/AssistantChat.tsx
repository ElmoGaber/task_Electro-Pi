import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAssistant } from '@/hooks/useAssistant'

const TYPE_ICON: Record<string, string> = { tip: '\u{1F4A1}', insight: '\u{1F4CA}', reminder: '\u{23F0}' }

export function AssistantChat() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const { data: suggestions, isLoading } = useAssistant()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [open, suggestions])

  return (
    <div className={`assistant-wrapper${open ? ' assistant-wrapper--open' : ''}`}>
      {open && (
        <div className="assistant-panel animate-scale">
          <div className="assistant-head">
            <span className="assistant-avatar">🤖</span>
            <span className="assistant-title">{t('assistant.title', 'AI Assistant')}</span>
            <button type="button" className="assistant-close" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="assistant-body" ref={listRef}>
            {isLoading ? (
              <div className="assistant-loading">{t('app.loading')}...</div>
            ) : !suggestions || suggestions.length === 0 ? (
              <div className="assistant-empty">{t('assistant.noSuggestions', 'No suggestions yet. Create some tasks!')}</div>
            ) : (
              suggestions.map((s, i) => (
                <div key={i} className={`assistant-msg assistant-msg--${s.type}`}>
                  <span className="assistant-msg-icon">{TYPE_ICON[s.type] ?? '\u{1F4AC}'}</span>
                  <div className="assistant-msg-text">{s.message}</div>
                </div>
              ))
            )}
          </div>
          <div className="assistant-foot">
            <small>{t('assistant.autoRefresh', 'Auto-refreshes every 2 min')}</small>
          </div>
        </div>
      )}
      <button
        className="assistant-fab"
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={t('assistant.title', 'AI Assistant')}
      >
        {open ? '\u{2716}' : '\u{1F916}'}
        {!open && suggestions && suggestions.length > 0 && (
          <span className="assistant-badge">{suggestions.length}</span>
        )}
      </button>
    </div>
  )
}

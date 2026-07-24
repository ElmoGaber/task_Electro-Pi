import { useTranslation } from 'react-i18next'

export function SettingsBar() {
  const { t } = useTranslation()

  const toggleReducedMotion = () => {
    const root = document.documentElement
    const current = root.getAttribute('data-reduced-motion')
    root.setAttribute('data-reduced-motion', current === 'true' ? 'false' : 'true')
    localStorage.setItem('taskflow-reduced-motion', current === 'true' ? 'false' : 'true')
  }

  const cycleFontSize = () => {
    const root = document.documentElement
    const sizes = ['small', 'medium', 'large']
    const current = root.getAttribute('data-font-size') || 'medium'
    const next = sizes[(sizes.indexOf(current) + 1) % sizes.length]
    root.setAttribute('data-font-size', next)
    localStorage.setItem('taskflow-font-size', next)
  }

  return (
    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
      <button className="button button-ghost button-sm" onClick={cycleFontSize} type="button" aria-label={t('settings.fontSize')}>
        {t('settings.fontSize')}
      </button>
      <button className="button button-ghost button-sm" onClick={toggleReducedMotion} type="button" aria-label={t('settings.reducedMotion')}>
        {t('settings.reducedMotion')}
      </button>
    </div>
  )
}

import { changeLanguage } from '@/i18n'

export function LanguageToggle() {
  const current = document.documentElement.lang || 'en'

  const toggle = () => {
    changeLanguage(current === 'en' ? 'ar' : 'en')
  }

  return (
    <button className="lang-toggle" onClick={toggle} type="button" aria-label="Toggle language">
      <span className={`lang-option ${current === 'en' ? 'active' : ''}`}>EN</span>
      <span className={`lang-option ${current === 'ar' ? 'active' : ''}`}>AR</span>
    </button>
  )
}

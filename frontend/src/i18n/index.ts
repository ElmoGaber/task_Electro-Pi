import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import ar from './ar.json'

const savedLang = localStorage.getItem('taskflow-lang') || 'en'
const savedDir = savedLang === 'ar' ? 'rtl' : 'ltr'

document.documentElement.dir = savedDir
document.documentElement.lang = savedLang

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export const changeLanguage = (lang: 'en' | 'ar') => {
  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lang
  localStorage.setItem('taskflow-lang', lang)
  i18n.changeLanguage(lang)
}

export default i18n

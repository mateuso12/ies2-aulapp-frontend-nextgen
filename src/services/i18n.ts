import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    common: {
      hello: 'Hello World',
      welcome: 'Welcome to Aulapp',
      change_language: 'Change language',
    },
  },
  'pt-BR': {
    common: {
      hello: 'Olá Mundo',
      welcome: 'Bem-vindo ao Aulapp',
      change_language: 'Trocar idioma',
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

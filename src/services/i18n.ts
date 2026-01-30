import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// pt-BR
import commonPT from '../locales/pt-BR/common.json'
import settingsPT from '../locales/pt-BR/settings.json'
import menuPT from '../locales/pt-BR/menu.json'
import annotationsPT from '../locales/pt-BR/annotations.json'
import highlightsPT from '../locales/pt-BR/highlights.json'
import buttonsPT from '../locales/pt-BR/buttons.json'
import footerPT from '../locales/pt-BR/footer.json'
import pageReelPT from '../locales/pt-BR/pageReel.json'
import classroomPT from '../locales/pt-BR/classroom.json'
import exercisesPT from '../locales/pt-BR/exercises.json'

// en
import commonEN from '../locales/en/common.json'
import settingsEN from '../locales/en/settings.json'
import menuEN from '../locales/en/menu.json'
import annotationsEN from '../locales/en/annotations.json'
import highlightsEN from '../locales/en/highlights.json'
import buttonsEN from '../locales/en/buttons.json'
import footerEN from '../locales/en/footer.json'
import pageReelEN from '../locales/en/pageReel.json'
import classroomEN from '../locales/en/classroom.json'
import exercisesEN from '../locales/en/exercises.json'

// es
import commonES from '../locales/es/common.json'
import settingsES from '../locales/es/settings.json'
import menuES from '../locales/es/menu.json'
import annotationsES from '../locales/es/annotations.json'
import highlightsES from '../locales/es/highlights.json'
import buttonsES from '../locales/es/buttons.json'
import footerES from '../locales/es/footer.json'
import pageReelES from '../locales/es/pageReel.json'
import classroomES from '../locales/es/classroom.json'
import exercisesES from '../locales/es/exercises.json'

const resources = {
  'pt-BR': {
    common: commonPT,
    settings: settingsPT,
    menu: menuPT,
    annotations: annotationsPT,
    highlights: highlightsPT,
    buttons: buttonsPT,
    footer: footerPT,
    pageReel: pageReelPT,
    classroom: classroomPT,
    exercises: exercisesPT,
  },
  en: {
    common: commonEN,
    settings: settingsEN,
    menu: menuEN,
    annotations: annotationsEN,
    highlights: highlightsEN,
    buttons: buttonsEN,
    footer: footerEN,
    pageReel: pageReelEN,
    classroom: classroomEN,
    exercises: exercisesEN,
  },
  es: {
    common: commonES,
    settings: settingsES,
    menu: menuES,
    annotations: annotationsES,
    highlights: highlightsES,
    buttons: buttonsES,
    footer: footerES,
    pageReel: pageReelES,
    classroom: classroomES,
    exercises: exercisesES,
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
    ns: [
      'common',
      'settings',
      'menu',
      'annotations',
      'highlights',
      'buttons',
      'footer',
      'pageReel',
      'classroom',
      'exercises',
    ],
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

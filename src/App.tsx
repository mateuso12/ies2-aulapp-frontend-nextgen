import '@/App.css'
import { useTranslation } from 'react-i18next'

function App() {
  const { t, i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language.startsWith('pt') ? 'en' : 'pt'
    i18n.changeLanguage(next)
  }

  return (
    <div className="app">
      <h1>{t('hello')}</h1>
      <p>{t('welcome')}</p>
      <button onClick={toggle}>{t('change_language')}</button>
    </div>
  )
}

export default App

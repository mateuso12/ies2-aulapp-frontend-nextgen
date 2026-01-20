import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Global } from 'iconsax-react'
import { useTranslation } from 'react-i18next'
import { CircleFlag } from 'react-circle-flags'

interface LanguageOption {
  code: string
  name: string
  countryCode: string
}

interface LanguageModalProps {
  isOpen: boolean
  onClose: () => void
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

const languages: LanguageOption[] = [
  { code: 'pt-BR', name: 'Português', countryCode: 'br' },
  { code: 'en', name: 'English', countryCode: 'gb' },
  { code: 'es', name: 'Español', countryCode: 'es' },
]

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation(['settings', 'common'])
  const [selectedLanguage, setSelectedLanguage] =
    React.useState(currentLanguage)

  // Sincronizar selectedLanguage quando currentLanguage mudar
  React.useEffect(() => {
    setSelectedLanguage(currentLanguage)
  }, [currentLanguage])

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code)
  }

  const handleConfirm = () => {
    onLanguageChange(selectedLanguage)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#2C2C2C] rounded-2xl w-[90vw] max-w-[652px] shadow-2xl flex flex-col"
              style={{ height: '400px' }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-8 pt-8 pb-8">
                <Global
                  size="24"
                  color="#2C2C2C"
                  variant="Linear"
                  className="dark:text-white shrink-0"
                />
                <h2 className="text-xl font-bold text-[#2C2C2C] dark:text-white">
                  {t('title')}
                </h2>
              </div>

              {/* Language Options - Centered */}
              <div className="flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-[300px] flex flex-col gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className="w-full flex items-center justify-between px-2 py-2 rounded-xl transition-all hover:bg-gray-50 dark:hover:bg-[#343A40] gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                          <CircleFlag
                            countryCode={language.countryCode}
                            height={32}
                            width={32}
                          />
                        </div>
                        <span className="text-base font-normal text-[#2C2C2C] dark:text-white">
                          {language.name}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center transition-all shrink-0 ${
                          selectedLanguage === language.code
                            ? 'border-[#6B7280] dark:border-gray-500'
                            : 'border-[#D1D5DB] dark:border-gray-600'
                        }`}
                      >
                        {selectedLanguage === language.code && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#6B7280] dark:bg-gray-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-8 pb-8 pt-4">
                <button
                  onClick={onClose}
                  className="text-base font-semibold text-[#FF246E] hover:text-[#E01F5F] transition-colors px-2"
                >
                  {t('cancel', { ns: 'common' })}
                </button>
                <button
                  onClick={handleConfirm}
                  className="text-base font-semibold text-white bg-[#FF246E] hover:bg-[#E01F5F] transition-colors px-10 py-3 rounded-2xl"
                >
                  {t('confirm', { ns: 'common' })}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

import React from 'react'
import { useTranslation } from 'react-i18next'

interface ExerciseProgressHeaderProps {
  currentPageIndex: number
  totalPages: number
}

export const ExerciseProgressHeader: React.FC<ExerciseProgressHeaderProps> = ({
  currentPageIndex,
  totalPages,
}) => {
  const { t } = useTranslation('exercises')
  const progress = ((currentPageIndex + 1) / totalPages) * 100

  return (
    <div>
      <div className="hidden sm:block h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden sm:mb-3">
        <div
          className="h-full bg-[#E91E63] transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <h2 className="hidden sm:block text-sm font-semibold text-gray-900 dark:text-gray-100">
        {t('questionLabel')} {currentPageIndex + 1}
      </h2>
    </div>
  )
}

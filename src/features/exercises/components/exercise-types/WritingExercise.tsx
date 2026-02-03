import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  ExerciseComponentProps,
  WritingData,
  WritingAnswer,
} from '../../types'
import { cn } from '@/lib/utils'
import { ExerciseFeedback } from '../ExerciseFeedback'
import { ViewCommentButton } from '../ViewCommentButton'
import { ExerciseComment } from '../ExerciseComment'

interface WritingExerciseProps extends ExerciseComponentProps<
  WritingData,
  WritingAnswer
> {
  resourceType?: string
  currentPageIndex?: number
  comment?: { title: string; content: string; imageUrl?: string }
}

export const WritingExercise: React.FC<WritingExerciseProps> = ({
  exercise,
  value = '',
  onChange,
  readonly = false,
  validationResult,
  disabled = false,
  resourceType,
  currentPageIndex,
  comment,
}) => {
  const { t } = useTranslation('exercises')
  const [localValue, setLocalValue] = useState(value)
  const [showComment, setShowComment] = useState(false)
  const maxChars = exercise.data.maxCharacters || 200

  // Sincroniza com valor externo
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    setShowComment(false)
  }, [exercise.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Aplica limite de caracteres
    if (newValue.length <= maxChars) {
      setLocalValue(newValue)
      onChange?.(newValue)
    }
  }

  // Determina o estado visual da caixa baseado no design do Figma
  const getContainerStyles = () => {
    if (!validationResult) {
      // Estado padrão: borda azul
      return {
        borderColor: 'border-[#C6D3F5]',
        backgroundColor: 'bg-white dark:bg-gray-800',
      }
    }

    if (validationResult.isCorrect) {
      // Estado correto: verde (#2BC779 border, #C9F6DB background)
      return {
        borderColor: 'border-[#2BC779]',
        backgroundColor: 'bg-[#C9F6DB] dark:bg-green-900/20',
      }
    } else {
      // Estado incorreto: vermelho (#EC272B border, #FFCAD6 background)
      return {
        borderColor: 'border-[#EC272B]',
        backgroundColor: 'bg-[#FFCAD6] dark:bg-red-900/20',
      }
    }
  }

  const { borderColor, backgroundColor } = getContainerStyles()

  return (
    <div className="w-full space-y-6">
      {/* Caixa de entrada */}
      <div
        className={cn(
          'relative rounded-4xl border-2 transition-all duration-200',
          borderColor,
          backgroundColor
        )}
      >
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={exercise.data.placeholder || t('writingPlaceholder')}
          disabled={readonly || disabled}
          maxLength={maxChars}
          className={cn(
            'w-full h-[103.643px] px-8 text-2xl text-center bg-transparent',
            'focus:outline-none placeholder:text-gray-400',
            'disabled:cursor-not-allowed',
            'text-gray-900 dark:text-gray-100'
          )}
        />

        {/* Contador de caracteres - oculto quando há validationResult */}
        {!validationResult && (
          <div className="absolute bottom-3 right-4 text-xs text-gray-500 dark:text-gray-400">
            {localValue.length}/{maxChars}
          </div>
        )}

        {validationResult &&
          !validationResult.isCorrect &&
          exercise.data.incorrectFeedback && (
            <div className="px-4 pb-4 md:px-6 md:pb-6">
              <ExerciseFeedback
                feedback={exercise.data.incorrectFeedback}
                variant="error"
              />
            </div>
          )}
      </div>

      {validationResult && comment && resourceType === 'simulation' && (
        <ViewCommentButton
          exerciseId={exercise.id}
          onClick={() => setShowComment(true)}
        />
      )}

      {validationResult &&
        comment &&
        resourceType === 'simulation' &&
        showComment && (
          <ExerciseComment
            exerciseId={exercise.id}
            questionNumber={currentPageIndex || 0 + 1}
            comment={comment}
            onBackToQuestion={() => {
              setShowComment(false)
              const mainElement = document.querySelector('main.overflow-auto')
              if (mainElement) {
                mainElement.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
            }}
          />
        )}
    </div>
  )
}

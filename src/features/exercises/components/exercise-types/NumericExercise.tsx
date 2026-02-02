import React, { useState, useEffect } from 'react'
import type {
  ExerciseComponentProps,
  NumericData,
  NumericAnswer,
} from '../../types'
import { cn } from '@/lib/utils'
import { ExerciseFeedback } from '../ExerciseFeedback'
import { ViewCommentButton } from '../ViewCommentButton'
import { ExerciseComment } from '../ExerciseComment'

interface NumericExerciseProps extends ExerciseComponentProps<
  NumericData,
  NumericAnswer
> {
  resourceType?: string
  currentPageIndex?: number
  comment?: { title: string; content: string; imageUrl?: string }
}

const formatNumberWithThousands = (value: string): string => {
  const parts = value.split(',')
  const integerPart = parts[0].replace(/\D/g, '')
  const decimalPart = parts[1] ? parts[1].replace(/\D/g, '') : ''

  if (!integerPart) return ''

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return decimalPart !== undefined && parts.length > 1
    ? `${formattedInteger},${decimalPart}`
    : formattedInteger
}

const parseFormattedNumber = (value: string): number => {
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export const NumericExercise: React.FC<NumericExerciseProps> = ({
  exercise,
  value = 0,
  onChange,
  readonly = false,
  validationResult,
  disabled = false,
  currentPageIndex,
  comment,
}) => {
  const [displayValue, setDisplayValue] = useState(
    value ? value.toString().replace('.', ',') : ''
  )
  const [showComment, setShowComment] = useState(false)

  useEffect(() => {
    setDisplayValue(value ? value.toString().replace('.', ',') : '')
  }, [value])

  useEffect(() => {
    setShowComment(false)
  }, [exercise.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    if (input === '') {
      setDisplayValue('')
      onChange?.(0)
      return
    }

    if (!/^[\d.,]*$/.test(input)) return

    const commaCount = (input.match(/,/g) || []).length
    if (commaCount > 1) return

    const formatted = formatNumberWithThousands(input)
    setDisplayValue(formatted)

    const numericValue = parseFormattedNumber(formatted)
    onChange?.(numericValue)
  }

  const getContainerStyles = () => {
    if (!validationResult) {
      return {
        borderColor: 'border-[#C6D3F5]',
        backgroundColor: 'bg-white dark:bg-gray-800',
      }
    }

    if (validationResult.isCorrect) {
      return {
        borderColor: 'border-[#2BC779]',
        backgroundColor: 'bg-[#C9F6DB] dark:bg-green-900/20',
      }
    } else {
      return {
        borderColor: 'border-[#EC272B]',
        backgroundColor: 'bg-[#FFCAD6] dark:bg-red-900/20',
      }
    }
  }

  const { borderColor, backgroundColor } = getContainerStyles()
  const showIncorrectFeedback = validationResult && !validationResult.isCorrect

  return (
    <div className="w-full space-y-6">
      <div
        className={cn(
          'relative rounded-4xl border-2 transition-all duration-200',
          borderColor,
          backgroundColor
        )}
      >
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder="0"
          disabled={readonly || disabled}
          className={cn(
            'w-full h-[103.643px] px-8 text-2xl text-center bg-transparent',
            'focus:outline-none placeholder:text-gray-400',
            'disabled:cursor-not-allowed',
            'text-gray-900 dark:text-gray-100'
          )}
        />

        {showIncorrectFeedback && validationResult.feedback && (
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <ExerciseFeedback
              feedback={validationResult.feedback}
              variant="error"
            />
          </div>
        )}
      </div>

      {validationResult && comment && (
        <ViewCommentButton
          exerciseId={exercise.id}
          onClick={() => setShowComment(true)}
        />
      )}

      {validationResult && comment && showComment && (
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

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ExerciseFeedback,
  ExerciseComment,
  ViewCommentButton,
  ExerciseResultIndicator,
  ExerciseProgressHeader,
} from '@/features/exercises/components'
import type {
  ExerciseValidationResult,
  TrueFalseExercise,
  TrueFalseAnswer,
  TrueFalseStatement,
  TrueFalseLabelVariant,
} from '@/features/exercises/types'

interface TrueFalseExerciseComponentProps {
  exercise: TrueFalseExercise
  currentPageIndex: number
  totalPages: number
  resourceType: string
  selectedAnswer: TrueFalseAnswer | undefined
  submittedAnswer?: {
    isCorrect: boolean
    userAnswer: TrueFalseAnswer
    comment?: { title: string; content: string; imageUrl?: string }
  }
  validationResult?: ExerciseValidationResult
  onSelectAnswer: (statementId: string, answer: boolean) => void
  onConfirmAnswer: () => void
}

const getLabelKey = (variant: TrueFalseLabelVariant) => {
  switch (variant) {
    case 'vf':
    case 'v-f':
    case 'v/f':
      return 'trueFalse.labels.vf'
    case 'sim-nao':
      return 'trueFalse.labels.simNao'
    case 'certo-errado':
      return 'trueFalse.labels.certoErrado'
    case 'thumbs':
      return 'trueFalse.labels.verdadeiroFalso'
    default:
      return 'trueFalse.labels.verdadeiroFalso'
  }
}

const ThumbsIcon = ({ type }: { type: 'up' | 'down' }) => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {type === 'up' ? (
      <path d="M2 10h4v12H2zM22 11c0-1.1-.9-2-2-2h-6.31l.95-4.57.02-.24c0-.31-.13-.61-.36-.85L13 2 7.59 7.41C7.22 7.78 7 8.3 7 8.83V20c0 1.1.9 2 2 2h7c.82 0 1.54-.5 1.84-1.22l3-7.05c.1-.23.16-.48.16-.73z" />
    ) : (
      <path d="M22 14h-4V2h4zM2 13c0 1.1.9 2 2 2h6.31l-.95 4.57-.02.24c0 .31.13.61.36.85L11 22l5.41-5.41c.37-.37.59-.89.59-1.42V4c0-1.1-.9-2-2-2H8c-.82 0-1.54.5-1.84 1.22l-3 7.05c-.1.23-.16.48-.16.73z" />
    )}
  </svg>
)

export const TrueFalseExerciseComponent: React.FC<
  TrueFalseExerciseComponentProps
> = ({
  exercise,
  currentPageIndex,
  totalPages,
  resourceType,
  selectedAnswer,
  submittedAnswer,
  validationResult,
  onSelectAnswer,
  onConfirmAnswer,
}) => {
  const { t } = useTranslation('exercises')
  const [showComment, setShowComment] = useState(false)

  useEffect(() => {
    setShowComment(false)
  }, [exercise.id])

  const statements: TrueFalseStatement[] = useMemo(() => {
    if (exercise.data.statements && exercise.data.statements.length > 0) {
      return exercise.data.statements
    }

    return [
      {
        id: exercise.id,
        text: exercise.description || exercise.title,
        correctAnswer: exercise.data.correctAnswer ?? false,
        incorrectFeedback: exercise.data.incorrectFeedback,
      },
    ]
  }, [exercise])

  const answersMap: Record<string, boolean | undefined> = useMemo(() => {
    if (typeof selectedAnswer === 'object' && selectedAnswer) {
      return selectedAnswer as Record<string, boolean>
    }

    return {
      [statements[0]?.id]: selectedAnswer as boolean | undefined,
    }
  }, [selectedAnswer, statements])

  const allAnswered = statements.every(
    (statement) => answersMap[statement.id] !== undefined
  )

  const resultMap = useMemo(() => {
    const details = validationResult?.details as {
      results?: Record<string, boolean>
    }
    if (details?.results) {
      return details.results
    }

    return statements.reduce<Record<string, boolean>>((acc, item) => {
      if (answersMap[item.id] === undefined) return acc
      acc[item.id] = answersMap[item.id] === item.correctAnswer
      return acc
    }, {})
  }, [validationResult, statements, answersMap])

  const labelVariant = exercise.data.labelVariant || 'verdadeiro-falso'
  const labelKey = getLabelKey(labelVariant)

  const isVerified = !!validationResult

  const handleVerify = () => {
    onConfirmAnswer()

    const firstStatement = document.getElementById(
      `true-false-${exercise.id}-${statements[0]?.id}`
    )
    const mainElement = document.querySelector('main.overflow-auto')
    if (firstStatement && mainElement) {
      mainElement.scrollTo({
        top: firstStatement.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div
      className={`w-full md:w-4xl mx-auto pb-8 ${
        resourceType === 'gamified' ? 'mt-8' : 'py-8'
      }`}
    >
      <div className="min-h-screen space-y-6">
        <ExerciseProgressHeader
          currentPageIndex={currentPageIndex}
          totalPages={totalPages}
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {exercise.title}
          </h1>
          {exercise.description && (
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {exercise.description}
            </p>
          )}
        </div>

        {isVerified && (
          <ExerciseResultIndicator
            isCorrect={validationResult?.isCorrect || false}
          />
        )}

        <div className="space-y-6">
          {statements.map((statement) => {
            const selected = answersMap[statement.id]
            const isCorrect = resultMap[statement.id]
            const showFeedback = isVerified && selected !== undefined
            const isIncorrect = showFeedback && !isCorrect

            const containerBorder = showFeedback
              ? isCorrect
                ? 'border-[#2BC779]'
                : 'border-[#EC272B]'
              : 'border-[#CCCCCC]'

            const containerBg = showFeedback
              ? isCorrect
                ? 'bg-[#E2F7EB]'
                : 'bg-[#FFCAD6]'
              : 'bg-white'

            return (
              <div
                key={statement.id}
                id={`true-false-${exercise.id}-${statement.id}`}
                className={`rounded-4xl border-2 px-8 py-8 space-y-6 ${containerBorder} ${containerBg}`}
              >
                <p className="text-sm font-normal text-gray-900">
                  {statement.text}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={isVerified}
                    onClick={() => onSelectAnswer(statement.id, true)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-[140px] ${
                      selected === true
                        ? 'bg-[#487BFF] text-white'
                        : 'bg-[#CFFFE7] text-[#2BC779]'
                    } ${isVerified ? 'opacity-60' : ''}`}
                  >
                    {labelVariant === 'thumbs' ? (
                      <ThumbsIcon type="up" />
                    ) : (
                      t(`${labelKey}.true`)
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isVerified}
                    onClick={() => onSelectAnswer(statement.id, false)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all w-[140px] ${
                      selected === false
                        ? 'bg-[#487BFF] text-white'
                        : 'bg-[#FFCAD6] text-[#F82653]'
                    } ${isVerified ? 'opacity-60' : ''}`}
                  >
                    {labelVariant === 'thumbs' ? (
                      <ThumbsIcon type="down" />
                    ) : (
                      t(`${labelKey}.false`)
                    )}
                  </button>
                </div>

                {isIncorrect && statement.incorrectFeedback && (
                  <ExerciseFeedback
                    feedback={statement.incorrectFeedback}
                    variant="error"
                  />
                )}
              </div>
            )
          })}
        </div>

        {!isVerified && (
          <div className="flex justify-center pt-8">
            <button
              onClick={handleVerify}
              disabled={!allAnswered}
              className={`px-12 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                allAnswered
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('verify')}
            </button>
          </div>
        )}

        {resourceType === 'simulation' && submittedAnswer?.comment && (
          <ViewCommentButton
            exerciseId={exercise.id}
            onClick={() => setShowComment(true)}
          />
        )}

        {resourceType === 'simulation' &&
          submittedAnswer?.comment &&
          showComment && (
            <ExerciseComment
              exerciseId={exercise.id}
              questionNumber={currentPageIndex + 1}
              comment={submittedAnswer.comment}
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
    </div>
  )
}

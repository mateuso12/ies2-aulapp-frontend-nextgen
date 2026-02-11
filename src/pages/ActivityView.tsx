import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  WritingExerciseComponent,
  MultipleChoiceExerciseComponent,
  NumericExerciseComponent,
  TrueFalseExerciseComponent,
  SpeechExercise,
  FluencyReadingExercise,
} from '@/features/exercises/components/exercise-types'
import {
  ExerciseResultIndicator,
  ExerciseProgressHeader,
} from '@/features/exercises/components'
import {
  isWritingExercise,
  isMultipleChoiceExercise,
  isNumericExercise,
  isTrueFalseExercise,
  isSpeechExercise,
  isFluencyReadingExercise,
} from '@/features/exercises/types'
import type {
  Exercise,
  ExerciseValidationResult,
} from '@/features/exercises/types'

interface ActivityViewProps {
  exercise: Exercise
  currentPageIndex: number
  totalPages: number
  resourceType: string
  selectedAnswer: string | string[] | number | undefined
  submittedAnswer?: {
    isCorrect: boolean
    userAnswer: string | string[] | number
    comment?: { title: string; content: string; imageUrl?: string }
  }
  validationResult?: ExerciseValidationResult
  onSelectOption: (optionId: string) => void
  onConfirmAnswer: () => void
  onVerifyWriting: () => void
  onWritingChange: (answer: string) => void
  onNumericChange: (answer: number) => void
  onTrueFalseChange: (statementId: string, answer: boolean) => void
  onVerifyTrueFalse: () => void
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  exercise,
  currentPageIndex,
  totalPages,
  resourceType,
  selectedAnswer,
  submittedAnswer,
  validationResult,
  onSelectOption,
  onConfirmAnswer,
  onVerifyWriting,
  onWritingChange,
  onNumericChange,
  onTrueFalseChange,
  onVerifyTrueFalse,
}) => {
  const { t } = useTranslation('exercises')

  if (isNumericExercise(exercise)) {
    const currentAnswer = (selectedAnswer as number) || 0
    const hasAnswer = currentAnswer !== 0
    const isSubmitted = !!submittedAnswer && submittedAnswer.isCorrect
    const isLocked = !!validationResult || isSubmitted

    return (
      <div
        className={`w-full md:w-4xl mx-auto sm:pb-8 ${
          resourceType === 'gamified' ? 'sm:mt-8' : 'sm:py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          <ExerciseProgressHeader
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.description}
              </p>
            )}
          </div>

          {validationResult && (
            <ExerciseResultIndicator isCorrect={validationResult.isCorrect} />
          )}

          <NumericExerciseComponent
            exercise={exercise}
            value={currentAnswer}
            onChange={(answer) => onNumericChange(answer)}
            readonly={isLocked}
            validationResult={validationResult}
            currentPageIndex={currentPageIndex}
            comment={submittedAnswer?.comment}
            resourceType={resourceType}
          />

          {!isSubmitted && !validationResult && (
            <div className="flex justify-center pt-8">
              <button
                onClick={onVerifyWriting}
                disabled={!hasAnswer}
                className={`px-12 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                  hasAnswer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('verify')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isWritingExercise(exercise)) {
    const currentAnswer = (selectedAnswer as string) || ''
    const hasAnswer = currentAnswer.trim().length > 0
    const isSubmitted = !!submittedAnswer && submittedAnswer.isCorrect
    const isLocked = !!validationResult || isSubmitted

    return (
      <div
        className={`w-full md:w-4xl mx-auto sm:pb-8 ${
          resourceType === 'gamified' ? 'sm:mt-8' : 'sm:py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          <ExerciseProgressHeader
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.description}
              </p>
            )}
          </div>

          {validationResult && (
            <ExerciseResultIndicator isCorrect={validationResult.isCorrect} />
          )}

          <WritingExerciseComponent
            exercise={exercise}
            value={currentAnswer}
            onChange={(answer) => onWritingChange(answer)}
            readonly={isLocked}
            validationResult={validationResult}
            currentPageIndex={currentPageIndex}
            comment={submittedAnswer?.comment}
            resourceType={resourceType}
          />

          {!isSubmitted && !validationResult && (
            <div className="flex justify-center pt-8">
              <button
                onClick={onVerifyWriting}
                disabled={!hasAnswer}
                className={`px-12 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                  hasAnswer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('verify')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isMultipleChoiceExercise(exercise)) {
    return (
      <MultipleChoiceExerciseComponent
        exercise={exercise}
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
        resourceType={resourceType}
        selectedAnswer={selectedAnswer as string | string[] | undefined}
        submittedAnswer={
          submittedAnswer as
            | {
                isCorrect: boolean
                userAnswer: string | string[]
                comment?: { title: string; content: string; imageUrl?: string }
              }
            | undefined
        }
        onSelectOption={onSelectOption}
        onConfirmAnswer={onConfirmAnswer}
      />
    )
  }

  if (isSpeechExercise(exercise)) {
    return (
      <div
        className={`w-full md:w-4xl mx-auto sm:pb-8 ${
          resourceType === 'gamified' ? 'sm:mt-8' : 'sm:py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          <ExerciseProgressHeader
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.description}
              </p>
            )}
          </div>

          <SpeechExercise exercise={exercise} />
        </div>
      </div>
    )
  }

  if (isFluencyReadingExercise(exercise)) {
    return (
      <div
        className={`w-full md:w-4xl mx-auto sm:pb-8 ${
          resourceType === 'gamified' ? 'sm:mt-8' : 'sm:py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          <ExerciseProgressHeader
            currentPageIndex={currentPageIndex}
            totalPages={totalPages}
          />

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4">
              {exercise.title}
            </h1>
            {exercise.description && (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {exercise.description}
              </p>
            )}
          </div>

          <FluencyReadingExercise exercise={exercise} />
        </div>
      </div>
    )
  }

  if (isTrueFalseExercise(exercise)) {
    return (
      <TrueFalseExerciseComponent
        exercise={exercise}
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
        resourceType={resourceType}
        selectedAnswer={
          selectedAnswer as boolean | Record<string, boolean> | undefined
        }
        submittedAnswer={
          submittedAnswer as
            | {
                isCorrect: boolean
                userAnswer: boolean | Record<string, boolean>
                comment?: { title: string; content: string; imageUrl?: string }
              }
            | undefined
        }
        validationResult={validationResult}
        onSelectAnswer={onTrueFalseChange}
        onConfirmAnswer={onVerifyTrueFalse}
      />
    )
  }

  return null
}

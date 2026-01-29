import React from 'react'
import {
  WritingExerciseComponent,
  MultipleChoiceExerciseComponent,
} from '@/features/exercises/components/exercise-types'
import {
  ExerciseComment,
  ViewCommentButton,
} from '@/features/exercises/components'
import {
  isWritingExercise,
  isMultipleChoiceExercise,
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
  selectedAnswer: string | string[] | undefined
  submittedAnswer?: {
    isCorrect: boolean
    userAnswer: string | string[]
    comment?: { title: string; content: string; imageUrl?: string }
  }
  validationResult?: ExerciseValidationResult
  onSelectOption: (optionId: string) => void
  onConfirmAnswer: () => void
  onVerifyWriting: () => void
  onWritingChange: (answer: string) => void
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
}) => {
  const progress = ((currentPageIndex + 1) / totalPages) * 100

  if (isWritingExercise(exercise)) {
    const currentAnswer = (selectedAnswer as string) || ''
    const hasAnswer = currentAnswer.trim().length > 0
    const isSubmitted = !!submittedAnswer && submittedAnswer.isCorrect
    const isLocked = !!validationResult || isSubmitted

    return (
      <div
        className={`w-full md:w-4xl mx-auto pb-8 ${
          resourceType === 'gamified' ? 'mt-8' : 'py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          <div>
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#E91E63] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Questão {currentPageIndex + 1}
            </h2>
          </div>

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

          <WritingExerciseComponent
            exercise={exercise}
            value={currentAnswer}
            onChange={(answer) => onWritingChange(answer)}
            readonly={isLocked}
            validationResult={validationResult}
          />

          {!isSubmitted && !validationResult && (
            <div className="flex justify-center">
              <button
                onClick={onVerifyWriting}
                disabled={!hasAnswer}
                className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                  hasAnswer
                    ? 'bg-[#487BFF] hover:bg-[#3869E6] cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Verificar
              </button>
            </div>
          )}

          {validationResult?.isCorrect &&
            submittedAnswer?.comment &&
            resourceType === 'simulation' && (
              <ViewCommentButton exerciseId={exercise.id} />
            )}

          {validationResult?.isCorrect &&
            submittedAnswer?.comment &&
            resourceType === 'simulation' && (
              <ExerciseComment
                exerciseId={exercise.id}
                questionNumber={currentPageIndex + 1}
                comment={submittedAnswer.comment}
                onBackToQuestion={() => {
                  const mainElement =
                    document.querySelector('main.overflow-auto')
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

  if (isMultipleChoiceExercise(exercise)) {
    return (
      <MultipleChoiceExerciseComponent
        exercise={exercise}
        currentPageIndex={currentPageIndex}
        totalPages={totalPages}
        resourceType={resourceType}
        selectedAnswer={selectedAnswer}
        submittedAnswer={submittedAnswer}
        onSelectOption={onSelectOption}
        onConfirmAnswer={onConfirmAnswer}
      />
    )
  }

  return null
}

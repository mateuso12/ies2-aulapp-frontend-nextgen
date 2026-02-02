import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ExerciseFeedback,
  ExerciseComment,
  ViewCommentButton,
  ExerciseResultIndicator,
} from '@/features/exercises/components'
import type {
  MultipleChoiceExercise,
  MultipleChoiceOption,
} from '@/features/exercises/types'

interface MultipleChoiceExerciseComponentProps {
  exercise: MultipleChoiceExercise
  currentPageIndex: number
  totalPages: number
  resourceType: string
  selectedAnswer: string | string[] | undefined
  submittedAnswer?: {
    isCorrect: boolean
    userAnswer: string | string[]
    comment?: { title: string; content: string; imageUrl?: string }
  }
  onSelectOption: (optionId: string) => void
  onConfirmAnswer: () => void
}

export const MultipleChoiceExerciseComponent: React.FC<
  MultipleChoiceExerciseComponentProps
> = ({
  exercise,
  currentPageIndex,
  totalPages,
  resourceType,
  selectedAnswer,
  submittedAnswer,
  onSelectOption,
  onConfirmAnswer,
}) => {
  const { t } = useTranslation('exercises')
  const [showComment, setShowComment] = useState(false)
  const progress = ((currentPageIndex + 1) / totalPages) * 100
  useEffect(() => {
    setShowComment(false)
  }, [exercise.id])
  const isMultipleSelect = true // Sempre permitir seleção múltipla
  const currentAnswer = selectedAnswer

  return (
    <div
      className={`w-full md:w-4xl mx-auto pb-8 ${
        resourceType === 'gamified' ? 'mt-8' : 'py-8'
      }`}
    >
      <div className="min-h-screen space-y-6">
        <div>
          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#E91E63] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('questionLabel')} {currentPageIndex + 1}
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

        <div className="space-y-4 mt-8">
          {exercise.data.options.map(
            (option: MultipleChoiceOption, index: number) => {
              const isSelected = isMultipleSelect
                ? Array.isArray(currentAnswer) &&
                  currentAnswer.includes(option.id)
                : currentAnswer === option.id

              const isSubmitted = !!submittedAnswer
              const isCorrectOption = option.isCorrect
              const showFeedback = isSubmitted

              let containerClasses = ''
              let borderClasses = ''
              let bgClasses = ''
              let radioClasses = ''
              let radioInnerClasses = ''

              if (showFeedback && isCorrectOption && isSelected) {
                containerClasses = 'h-auto min-h-[104px]'
                borderClasses = 'border-2 border-[#2BC779]'
                bgClasses = 'bg-[#C9F6DB]'
                radioClasses = 'hidden'
              } else if (showFeedback && !isCorrectOption && isSelected) {
                containerClasses = 'h-auto min-h-[104px]'
                borderClasses = 'border-2 border-[#EC272B]'
                bgClasses = 'bg-[#FFCAD6]'
                radioClasses = 'hidden'
              } else if (isSelected && !showFeedback) {
                containerClasses = 'h-[104px]'
                borderClasses = 'border-4 border-[#487BFF]'
                bgClasses = 'bg-[#C6D3F5]'
                radioClasses =
                  'w-[39px] h-[39px] rounded-full border-3 border-[#487BFF] bg-white flex items-center justify-center'
                radioInnerClasses =
                  'w-[22px] h-[22px] rounded-full bg-[#487BFF] border-3 border-white'
              } else {
                containerClasses = 'h-[104px]'
                borderClasses = 'border-2 border-[#CCCCCC]'
                bgClasses = 'bg-white hover:border-[#487BFF]'
                radioClasses =
                  'w-[39px] h-[39px] rounded-full border-3 border-[#6C757D] bg-white'
                radioInnerClasses = ''
              }

              const optionLetter = String.fromCharCode(65 + index) + ')'

              return (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => !isSubmitted && onSelectOption(option.id)}
                    disabled={isSubmitted}
                    className={`w-full rounded-4xl transition-all ${containerClasses} ${borderClasses} ${bgClasses} ${
                      !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-start gap-4 px-7 py-[31px]">
                      <p className="font-plus-jakarta font-bold text-[14px] text-black shrink-0">
                        {optionLetter}
                      </p>
                      <p className="font-plus-jakarta font-normal text-[14px] text-black leading-normal flex-1 text-left">
                        {option.text}
                      </p>
                      {!showFeedback && (
                        <div className={`shrink-0 ${radioClasses}`}>
                          {isSelected && (
                            <div className={radioInnerClasses}></div>
                          )}
                        </div>
                      )}
                      {showFeedback && isCorrectOption && isSelected && (
                        <div className="flex items-center gap-1 shrink-0">
                          <svg
                            className="w-10 h-10"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="20" cy="20" r="20" fill="#2BC779" />
                            <path
                              d="M16.667 20L18.333 21.667L23.333 16.667"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="font-plus-jakarta font-semibold text-[16px] text-black tracking-[-0.24px]">
                            {t('correct')}
                          </p>
                        </div>
                      )}
                      {showFeedback && !isCorrectOption && isSelected && (
                        <div className="flex items-center gap-1 shrink-0">
                          <svg
                            className="w-10 h-10"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="20" cy="20" r="20" fill="#EC272B" />
                            <path
                              d="M15.556 15.556L24.444 24.444M24.444 15.556L15.556 24.444"
                              stroke="white"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="font-plus-jakarta font-semibold text-[16px] text-black tracking-[-0.24px]">
                            {t('wrong')}
                          </p>
                        </div>
                      )}
                    </div>

                    {showFeedback &&
                      !isCorrectOption &&
                      isSelected &&
                      option.feedback && (
                        <div className="px-6 pb-6">
                          <ExerciseFeedback
                            feedback={option.feedback}
                            variant="error"
                          />
                        </div>
                      )}
                  </button>
                </div>
              )
            }
          )}
        </div>

        {submittedAnswer && (
          <ExerciseResultIndicator isCorrect={submittedAnswer.isCorrect} />
        )}

        {!submittedAnswer && (
          <div className="flex justify-center pt-8">
            <button
              onClick={onConfirmAnswer}
              disabled={
                !currentAnswer ||
                (Array.isArray(currentAnswer) && currentAnswer.length === 0)
              }
              className={`px-12 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                currentAnswer &&
                (!Array.isArray(currentAnswer) || currentAnswer.length > 0)
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {t('verify')}
            </button>
          </div>
        )}

        {submittedAnswer?.comment && (
          <ViewCommentButton
            exerciseId={exercise.id}
            onClick={() => setShowComment(true)}
          />
        )}

        {submittedAnswer?.comment && showComment && (
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

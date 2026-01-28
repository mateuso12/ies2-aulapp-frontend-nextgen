/**
 * ActivityView - Renderiza atividades/exercícios
 */

import React from 'react'
import { WritingExerciseComponent } from '@/features/exercises/components/exercise-types'
import {
  isWritingExercise,
  isMultipleChoiceExercise,
  isMultipleSelectExercise,
} from '@/features/exercises/types'
import type {
  Exercise,
  ExerciseValidationResult,
  MultipleChoiceOption,
} from '@/features/exercises/types'

interface ActivityViewProps {
  /** Exercício a ser renderizado */
  exercise: Exercise
  /** Índice da página atual (para exibir número da questão) */
  currentPageIndex: number
  /** Total de páginas */
  totalPages: number
  /** Tipo de recurso (content, simulated, gamified) */
  resourceType: string
  /** Resposta selecionada pelo usuário */
  selectedAnswer: string | string[] | undefined
  /** Resposta submetida (após confirmação) */
  submittedAnswer?: {
    isCorrect: boolean
    userAnswer: string | string[]
    comment?: { title: string; content: string; imageUrl?: string }
  }
  /** Resultado da validação (para writing exercises) */
  validationResult?: ExerciseValidationResult
  /** Callback quando o usuário seleciona uma opção */
  onSelectOption: (optionId: string) => void
  /** Callback quando o usuário confirma a resposta */
  onConfirmAnswer: () => void
  /** Callback quando o usuário verifica resposta de escrita */
  onVerifyWriting: () => void
  /** Callback quando o usuário muda a resposta de escrita */
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
  // Calcula o progresso (página atual / total de páginas)
  const progress = ((currentPageIndex + 1) / totalPages) * 100

  // Verifica se é um exercício de escrita
  if (isWritingExercise(exercise)) {
    const currentAnswer = (selectedAnswer as string) || ''
    const hasAnswer = currentAnswer.trim().length > 0
    const isSubmitted = !!submittedAnswer && submittedAnswer.isCorrect
    // Campo travado após verificação (quando há validationResult) ou quando submetido
    const isLocked = !!validationResult || isSubmitted

    return (
      <div
        className={`w-full md:w-4xl mx-auto pb-8 ${
          resourceType === 'gamified' ? 'mt-8' : 'py-8'
        }`}
      >
        <div id={`exercise-${exercise.id}`} className="min-h-screen space-y-6">
          {/* Progress bar */}
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

          {/* Título principal */}
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

          {/* Componente de Atividade de Escrita */}
          <WritingExerciseComponent
            exercise={exercise}
            value={currentAnswer}
            onChange={(answer) => onWritingChange(answer)}
            readonly={isLocked}
            validationResult={validationResult}
            resourceType={resourceType}
          />

          {/* Botão Verificar */}
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

          {/* Seção de Comentário (apenas se correto e em recurso simulado) */}
          {submittedAnswer &&
            submittedAnswer.isCorrect &&
            submittedAnswer.comment &&
            resourceType === 'gamified' && (
              <div
                id={`comment-${exercise.id}`}
                className="min-h-screen border-t-2 border-gray-200 pt-12 mt-16"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  Comentário {exercise.title}
                </h2>
                {submittedAnswer.comment.imageUrl && (
                  <img
                    src={submittedAnswer.comment.imageUrl}
                    alt={submittedAnswer.comment.title}
                    className="w-full rounded-lg mb-6"
                  />
                )}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {submittedAnswer.comment.title}
                  </h3>
                  <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {submittedAnswer.comment.content}
                  </p>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      document
                        .getElementById(`exercise-${exercise.id}`)
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="px-6 py-2 rounded-lg font-semibold text-[#487BFF] border-2 border-[#487BFF] hover:bg-[#487BFF] hover:text-white transition-all"
                  >
                    Voltar para questão
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    )
  }

  // Exercícios de múltipla escolha/seleção
  if (
    isMultipleChoiceExercise(exercise) ||
    isMultipleSelectExercise(exercise)
  ) {
    const correctCount = exercise.data.options.filter(
      (opt) => opt.isCorrect
    ).length
    const isMultipleSelect = correctCount > 1
    const currentAnswer = selectedAnswer

    return (
      <div
        className={`w-full md:w-[896px] mx-auto pb-8 ${
          resourceType === 'gamified' ? 'mt-8' : 'py-8'
        }`}
      >
        <div className="min-h-screen space-y-6">
          {/* Progress bar */}
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

          {/* Título principal */}
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

          {/* Opções */}
          <div className="space-y-3 mt-8">
            {exercise.data.options.map(
              (option: MultipleChoiceOption, _index: number) => {
                const isSelected = isMultipleSelect
                  ? Array.isArray(currentAnswer) &&
                    currentAnswer.includes(option.id)
                  : currentAnswer === option.id

                const isSubmitted = !!submittedAnswer
                const isCorrectOption = option.isCorrect
                const showFeedback = isSubmitted

                let optionBgClass = 'bg-white dark:bg-gray-800'
                let optionBorderClass = isSelected
                  ? 'border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
                const optionTextClass = 'text-gray-900 dark:text-gray-100'

                if (showFeedback) {
                  if (isCorrectOption) {
                    optionBgClass = 'bg-green-50 dark:bg-green-900/20'
                    optionBorderClass = 'border-green-500'
                  } else if (isSelected) {
                    optionBgClass = 'bg-red-50 dark:bg-red-900/20'
                    optionBorderClass = 'border-red-500'
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => !isSubmitted && onSelectOption(option.id)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionBgClass} ${optionBorderClass} ${optionTextClass} ${
                      !isSubmitted ? 'hover:border-blue-400 cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          isSelected ? 'border-blue-500' : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <span className="flex-1 text-base leading-relaxed">
                        {option.text}
                      </span>
                      {showFeedback && isCorrectOption && (
                        <svg
                          className="flex-shrink-0 w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {showFeedback && !isCorrectOption && isSelected && (
                        <svg
                          className="flex-shrink-0 w-6 h-6 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              }
            )}
          </div>

          {/* Botão Confirmar */}
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
                Confirmar
              </button>
            </div>
          )}

          {/* Feedback */}
          {submittedAnswer && (
            <div
              className={`p-6 rounded-lg ${
                submittedAnswer.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                  : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
              }`}
            >
              <p
                className={`text-lg font-semibold ${
                  submittedAnswer.isCorrect
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}
              >
                {submittedAnswer.isCorrect
                  ? '✓ Resposta correta!'
                  : '✗ Resposta incorreta'}
              </p>
            </div>
          )}

          {/* Link para comentário (após verificação correta) */}
          {submittedAnswer?.comment && submittedAnswer.isCorrect && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => {
                  document
                    .getElementById(`comment-${exercise.id}`)
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-semibold rounded-lg transition-colors"
              >
                Ver comentário
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M12 8v8m0 0l4-4m-4 4l-4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Seção de Comentário (apenas se correto) */}
          {submittedAnswer?.comment && submittedAnswer.isCorrect && (
            <div id={`comment-${exercise.id}`} className="mt-16 pt-8 border-t">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Comentário Questão {currentPageIndex + 1}
              </h3>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {submittedAnswer.comment.title}
              </h2>
              {submittedAnswer.comment.imageUrl && (
                <img
                  src={submittedAnswer.comment.imageUrl}
                  alt={submittedAnswer.comment.title}
                  className="w-full h-64 object-cover rounded-xl mb-6"
                />
              )}
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {submittedAnswer.comment.content}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    // Scroll no container principal (main com overflow-auto)
                    const mainElement =
                      document.querySelector('main.overflow-auto')
                    if (mainElement) {
                      mainElement.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })
                    }
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-semibold rounded-lg transition-colors"
                >
                  Voltar para questão
                  <svg
                    className="w-5 h-5 rotate-180"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M12 8v8m0 0l4-4m-4 4l-4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

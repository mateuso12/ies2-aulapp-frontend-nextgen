import React, { useState, useMemo } from 'react'
import parse from 'html-react-parser'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout/index'
import { mockExercises } from '../mocks/exercises'
import { TextHighlighter } from '@/features/annotations/highlighting'
import { createFirebaseHighlightRepository } from '@/features/annotations/highlighting/repositories'
import { useUser } from '@/hooks/useUser'
import { usePageProgress } from '@/hooks/usePageProgress'
import { DevTools } from '@/features/virtual-classroom/components/overlays'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'

export const VirtualClassroom: React.FC = () => {
  const { userId } = useUser()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [resourceType, setResourceType] = useState('content')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, { isCorrect: boolean, userAnswer: string | string[], comment?: { title: string, content: string, imageUrl?: string } | undefined }>>({})
  const [remainingAttempts, setRemainingAttempts] = useState<Record<string, number>>({})
  
  const resourceId = 'virtual-classroom-demo'
  
  // Apenas exercícios (um por página)
  const allPages = useMemo(() => {
    return mockExercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      contentHtml: '' as string, // Exercícios não têm HTML
      isExercise: true as const,
      exercise,
    }))
  }, [])
  
  const totalPages = allPages.length
  const currentPage = allPages[currentPageIndex]
  const isExercisePage = 'isExercise' in currentPage && currentPage.isExercise
  
  const {
    visitedPages,
    bookmarks,
    toggleBookmark,
    removeBookmark,
  } = usePageProgress({
    resourceId,
    userId,
    currentPage: currentPageIndex + 1,
  })

  const maxReachedIndex = useMemo(() => {
    if (visitedPages.length === 0) return 0
    return Math.max(...visitedPages) - 1
  }, [visitedPages])

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageIndex(page - 1)
    }
  }

  const handleToggleBookmark = (page: number) => {
    toggleBookmark(page)
  }

  const handleRemoveBookmark = (page: number) => {
    removeBookmark(page)
  }

  // Handler para seleção de alternativas
  const handleSelectOption = (exerciseId: string, optionId: string) => {
    const exercise = mockExercises.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    // Verifica se é múltipla seleção (mais de uma correta)
    const correctCount = exercise.data.options.filter((opt) => opt.isCorrect).length
    const isMultipleSelect = correctCount > 1

    if (isMultipleSelect) {
      // Múltipla seleção: toggle
      const current = (selectedAnswers[exerciseId] as string[]) || []
      const newSelection = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      setSelectedAnswers({ ...selectedAnswers, [exerciseId]: newSelection })
    } else {
      // Única escolha: substitui
      setSelectedAnswers({ ...selectedAnswers, [exerciseId]: optionId })
    }
  }

  // Handler para confirmar resposta
  const handleConfirmAnswer = (exerciseId: string) => {
    const exercise = mockExercises.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    const userAnswer = selectedAnswers[exerciseId]
    const correctOptions = exercise.data.options.filter((opt) => opt.isCorrect).map((opt) => opt.id)
    
    let isCorrect = false
    if (Array.isArray(userAnswer)) {
      // Múltipla seleção: verifica se todas corretas foram selecionadas e nenhuma incorreta
      isCorrect = userAnswer.length === correctOptions.length && 
                  userAnswer.every(id => correctOptions.includes(id))
    } else {
      // Única escolha: verifica se a selecionada é a correta
      isCorrect = correctOptions.includes(userAnswer)
    }

    // Simula resposta do endpoint com comentário
    const comment = exercise.metadata?.comment as { title: string, content: string, imageUrl?: string } | undefined

    // Atualiza tentativas restantes
    const currentAttempts = remainingAttempts[exerciseId] ?? (exercise.maxAttempts || 1)
    const newAttempts = isCorrect ? 0 : currentAttempts - 1
    
    setRemainingAttempts({
      ...remainingAttempts,
      [exerciseId]: newAttempts
    })

    setSubmittedAnswers({ 
      ...submittedAnswers, 
      [exerciseId]: { isCorrect, userAnswer, comment } 
    })
  }

  // Handler para tentar novamente
  const handleTryAgain = (exerciseId: string) => {
    // Remove a submissão e limpa a resposta selecionada
    const newSubmitted = { ...submittedAnswers }
    delete newSubmitted[exerciseId]
    setSubmittedAnswers(newSubmitted)
    
    const newSelected = { ...selectedAnswers }
    delete newSelected[exerciseId]
    setSelectedAnswers(newSelected)
  }

  const pagesData: PageData[] = allPages.map((page, index) => {
    const pageNumber = index + 1
    const isLocked = pageNumber > maxReachedIndex + 3
    const isCompleted = visitedPages.includes(pageNumber)

    // Para páginas de exercício, não precisa parsear contentHtml (será renderizado de forma customizada)
    const content = 'exercise' in page && page.exercise ? null : parse(page.contentHtml || '')

    return {
      id: typeof page.id === 'number' ? page.id : page.id,
      content,
      isLocked,
      isCompleted,
      hasDrawings: index === 1 || index === 3,
      hasAnnotations: index === 0 || index === 2,
      isBookmarked: bookmarks.includes(pageNumber),
    }
  })

  const highlightRepository = useMemo(() => {
    if (!userId) return undefined
    return createFirebaseHighlightRepository(userId)
  }, [userId])

  return (
    <>
      <DevTools
        resourceType={resourceType}
        onResourceTypeChange={setResourceType}
      />
      <VirtualClassroomLayout
        variant={resourceType === 'gamified' ? 'gamified' : 'default'}
        resourceType={resourceType}
        currentPage={currentPageIndex + 1}
        totalPages={totalPages}
        pages={pagesData}
        bookmarks={bookmarks}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onPageSelect={handlePageSelect}
        onToggleBookmark={handleToggleBookmark}
        onRemoveBookmark={handleRemoveBookmark}
      >
        {({ isOtherToolActive }) => (
          <>
            {!isExercisePage ? (
              /* Conteúdo de texto normal */
              <TextHighlighter
                key={`${currentPage.id}-${userId || 'loading'}`}
                documentId={`virtual-classroom-page-${currentPage.id}`}
                contentHtml={currentPage.contentHtml || ''}
                disabled={isOtherToolActive}
                repository={highlightRepository}
              />
            ) : (
              /* Página de exercício */
              <div className="w-full md:w-[896px] mx-auto py-8">
                {(() => {
                  const exercise = currentPage.exercise
                  if (!exercise) return null

                  const correctCount = exercise.data.options.filter((opt) => opt.isCorrect).length
                  const isMultipleSelect = correctCount > 1
                  const currentAnswer = selectedAnswers[exercise.id]
                  const hasAnswer = isMultipleSelect
                    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
                    : !!currentAnswer

                  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                  
                  // Calcula o progresso (página atual / total de páginas)
                  const progress = ((currentPageIndex + 1) / totalPages) * 100

                  return (
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
                          {exercise.title}
                        </h2>
                      </div>

                      {/* Título principal */}
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                          {exercise.title} Enunciado
                        </h1>
                        {exercise.description && (
                          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                            {exercise.description}
                          </p>
                        )}
                      </div>

                      {/* Opções */}
                      <div className="space-y-3 mt-8">
                        {exercise.data.options.map((option, index) => {
                          const isSelected = isMultipleSelect
                            ? Array.isArray(currentAnswer) && currentAnswer.includes(option.id)
                            : currentAnswer === option.id

                          const submission = submittedAnswers[exercise.id]
                          const isSubmitted = !!submission
                          const isCorrectOption = option.isCorrect
                          const showAsCorrect = isSubmitted && isCorrectOption && submission.isCorrect
                          const showAsIncorrect = isSubmitted && isSelected && !submission.isCorrect

                          return (
                            <button
                              key={option.id}
                              onClick={() => !isSubmitted && handleSelectOption(exercise.id, option.id)}
                              disabled={isSubmitted}
                              className={`w-full px-6 py-4 text-left rounded-[20px] border-2 transition-all ${
                                showAsCorrect
                                  ? 'border-[#4ADE80] bg-[#DCFCE7]'
                                  : showAsIncorrect
                                  ? 'border-[#F87171] bg-[#FEE2E2]'
                                  : isSelected && !isSubmitted
                                  ? 'border-[#4B80F9] bg-[#4B80F9]/10'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                              } ${
                                !isSubmitted && 'hover:border-blue-300 cursor-pointer'
                              } ${
                                isSubmitted && 'cursor-default'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                  <span className="font-bold text-gray-900 dark:text-gray-100 text-base">
                                    {optionLabels[index]})
                                  </span>
                                  <span className="text-base text-gray-700 dark:text-gray-300 flex-1">
                                    {option.text}
                                  </span>
                                </div>
                                {showAsCorrect ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#4ADE80] flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                      </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Correto</span>
                                  </div>
                                ) : showAsIncorrect ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-[#F87171] flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M6 18L18 6M6 6l12 12"></path>
                                      </svg>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Incorreto</span>
                                  </div>
                                ) : (
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                      isSelected && !isSubmitted
                                        ? 'border-blue-500 bg-white'
                                        : 'border-gray-400 dark:border-gray-500 bg-white'
                                    }`}
                                  >
                                    {isSelected && !isSubmitted && (
                                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Botão de verificação */}
                      {!submittedAnswers[exercise.id] && (
                        <div className="flex justify-center pt-8">
                          <button
                            onClick={() => handleConfirmAnswer(exercise.id)}
                            disabled={!hasAnswer}
                            className={`px-12 py-3 rounded-lg font-semibold text-base transition-all ${
                              hasAnswer
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Verificar
                          </button>
                        </div>
                      )}

                      {/* Botão Tentar Novamente (quando incorreto e há tentativas) */}
                      {submittedAnswers[exercise.id] && !submittedAnswers[exercise.id].isCorrect && (remainingAttempts[exercise.id] ?? (exercise.maxAttempts || 0)) > 0 && (
                        <div className="flex flex-col items-center gap-4 pt-8">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Tentativas restantes: <span className="font-bold">{remainingAttempts[exercise.id] ?? (exercise.maxAttempts || 0)}</span>
                          </p>
                          <button
                            onClick={() => handleTryAgain(exercise.id)}
                            className="px-12 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition-colors"
                          >
                            Tentar Novamente
                          </button>
                        </div>
                      )}

                      {/* Link para comentário (após verificação correta) */}
                      {submittedAnswers[exercise.id]?.comment && submittedAnswers[exercise.id].isCorrect && (
                        <div className="flex justify-center pt-8">
                          <button
                            onClick={() => {
                              const commentElement = document.getElementById(`comment-${exercise.id}`)
                              if (commentElement) {
                                commentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                            }}
                            className="flex items-center gap-2 text-[#E91E63] hover:text-[#C2185B] font-semibold text-base transition-colors"
                          >
                            Ir para o comentário
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <path d="M12 8v8m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Seção de Comentário (apenas se correto) */}
                      {submittedAnswers[exercise.id]?.comment && submittedAnswers[exercise.id].isCorrect && (
                        <div id={`comment-${exercise.id}`} className="mt-16 pt-8 border-t">
                          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                            Comentário Questão {currentPageIndex + 1}
                          </h3>
                          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            {submittedAnswers[exercise.id].comment!.title}
                          </h2>
                          {submittedAnswers[exercise.id].comment!.imageUrl && (
                            <img
                              src={submittedAnswers[exercise.id].comment!.imageUrl}
                              alt={submittedAnswers[exercise.id].comment!.title}
                              className="w-full h-64 object-cover rounded-xl mb-6"
                            />
                          )}
                          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                            {submittedAnswers[exercise.id].comment!.content}
                          </p>
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                // Scroll no container principal (main com overflow-auto)
                                const mainElement = document.querySelector('main.overflow-auto')
                                if (mainElement) {
                                  mainElement.scrollTo({ top: 0, behavior: 'smooth' })
                                }
                              }}
                              className="flex items-center gap-2 px-8 py-3 bg-[#E91E63] hover:bg-[#C2185B] text-white font-semibold rounded-lg transition-colors"
                            >
                              Voltar para questão
                              <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M12 8v8m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            )}
          </>
        )}
      </VirtualClassroomLayout>
    </>
  )
}

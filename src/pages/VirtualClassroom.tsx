import React, { useState, useMemo } from 'react'
import parse from 'html-react-parser'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout/index'
import { mockContentPages } from '../mocks/virtualClassroomContent'
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
  
  const resourceId = 'virtual-classroom-demo'
  
  // Apenas exercícios (um por página)
  const allPages = useMemo(() => {
    return mockExercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      contentHtml: '', // Exercícios não têm HTML
      isExercise: true,
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
    const answer = selectedAnswers[exerciseId]
    console.log('Resposta confirmada:', { exerciseId, answer })
    // TODO: Integrar com sistema de submissão
    alert(`Resposta confirmada para ${exerciseId}!`)
  }

  const pagesData: PageData[] = allPages.map((page, index) => {
    const pageNumber = index + 1
    const isLocked = pageNumber > maxReachedIndex + 3
    const isCompleted = visitedPages.includes(pageNumber)

    // Para páginas de exercício, não precisa parsear contentHtml (será renderizado de forma customizada)
    const content = 'exercise' in page ? null : parse(page.contentHtml || '')

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
              <div className="max-w-4xl mx-auto py-8">
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

                  return (
                    <div className="space-y-6">
                      {/* Header pequeno com barra colorida */}
                      <div>
                        <div className="h-1 w-20 bg-pink-500 mb-3 rounded-full"></div>
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

                          return (
                            <button
                              key={option.id}
                              onClick={() => handleSelectOption(exercise.id, option.id)}
                              className={`w-full p-5 text-left rounded-[20px] border-2 transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-blue-300'
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
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-400 dark:border-gray-500'
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                  )}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Botão de verificação */}
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

                      {/* Dicas (mantidas, mas com estilo mais discreto) */}
                      {exercise.hints && exercise.hints.length > 0 && (
                        <details className="mt-8 p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                          <summary className="cursor-pointer font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 text-sm">
                            💡 Dicas disponíveis
                          </summary>
                          <ul className="mt-3 ml-4 space-y-2 text-sm text-amber-900 dark:text-amber-200">
                            {exercise.hints.map((hint, idx) => (
                              <li key={idx}>• {hint}</li>
                            ))}
                          </ul>
                        </details>
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

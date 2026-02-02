import React, { useState, useMemo } from 'react'
import parse from 'html-react-parser'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout/index'
import { ContentView } from './ContentView'
import { ActivityView } from './ActivityView'
import { MaterialView } from './MaterialView'
import { mockActivities } from '../mocks/activities'
import { mockContentPages } from '../mocks/content'
import {
  mockSupportMaterials,
  mockSupportMaterialsApi,
} from '../mocks/supportMaterials'
import { createFirebaseHighlightRepository } from '@/features/annotations/highlighting/repositories'
import { useUser } from '@/hooks/useUser'
import { usePageProgress } from '@/hooks/usePageProgress'
import { useAudioFeedback } from '@/hooks/useAudioFeedback'
import { DevTools } from '@/features/virtual-classroom/components/overlays'
import { validateExercise } from '@/features/exercises/lib/utils'
import {
  isWritingExercise,
  isMultipleChoiceExercise,
  isNumericExercise,
} from '@/features/exercises/types'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'
import type { ExerciseValidationResult } from '@/features/exercises/types'

export const VirtualClassroom: React.FC = () => {
  const { userId } = useUser()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [resourceType, setResourceType] = useState('content')
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string | string[] | number>
  >({})
  const [submittedAnswers, setSubmittedAnswers] = useState<
    Record<
      string,
      {
        isCorrect: boolean
        userAnswer: string | string[] | number
        comment?:
          | { title: string; content: string; imageUrl?: string }
          | undefined
      }
    >
  >({})
  const [validationResults, setValidationResults] = useState<
    Record<string, ExerciseValidationResult>
  >({})

  const { playSuccess, playError } = useAudioFeedback()

  const resourceId = 'virtual-classroom-demo'

  // Combina conteúdo e atividades em páginas
  const allPages = useMemo(() => {
    // Se resourceType for 'content', retorna páginas de conteúdo
    if (resourceType === 'content') {
      return mockContentPages.map((page) => ({
        id: page.id,
        title: page.title,
        contentHtml: page.contentHtml,
        isExercise: false as const,
      }))
    }

    // Se resourceType for 'material', retorna uma única "página" de materiais
    if (resourceType === 'material') {
      return [
        {
          id: 'support-materials',
          title: 'Material de Apoio',
          contentHtml: '',
          isExercise: false as const,
          isMaterialView: true as const,
        },
      ]
    }

    // Para outros resourceTypes, retorna atividades
    return mockActivities.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      contentHtml: '',
      isExercise: true as const,
      exercise,
    }))
  }, [resourceType])

  const totalPages = allPages.length
  const currentPage = allPages[currentPageIndex]
  const isExercisePage = 'isExercise' in currentPage && currentPage.isExercise
  const isMaterialView =
    'isMaterialView' in currentPage && currentPage.isMaterialView

  const { visitedPages, bookmarks, toggleBookmark, removeBookmark } =
    usePageProgress({
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
    const exercise = mockActivities.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    if (!isMultipleChoiceExercise(exercise)) return

    const isMultipleSelect = true // Sempre permitir seleção múltipla

    if (isMultipleSelect) {
      const current = (selectedAnswers[exerciseId] as string[]) || []
      const newSelection = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      setSelectedAnswers({ ...selectedAnswers, [exerciseId]: newSelection })
    } else {
      setSelectedAnswers({ ...selectedAnswers, [exerciseId]: optionId })
    }
  }

  // Handler para confirmar resposta
  const handleConfirmAnswer = (exerciseId: string) => {
    const exercise = mockActivities.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    if (!isMultipleChoiceExercise(exercise)) return

    const userAnswer = selectedAnswers[exerciseId]
    const correctOptions = exercise.data.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt.id)

    let isCorrect = false
    if (Array.isArray(userAnswer)) {
      isCorrect =
        userAnswer.length === correctOptions.length &&
        userAnswer.every((id) => correctOptions.includes(id))
    } else if (typeof userAnswer === 'string') {
      isCorrect = correctOptions.includes(userAnswer)
    }

    // Toca o áudio de feedback
    if (isCorrect) {
      playSuccess()
    } else {
      playError()
    }

    const comment = exercise.metadata?.comment as
      | { title: string; content: string; imageUrl?: string }
      | undefined

    setSubmittedAnswers({
      ...submittedAnswers,
      [exerciseId]: { isCorrect, userAnswer, comment },
    })
  }

  // Handler para verificar resposta de atividade de escrita
  const handleVerifyWriting = (exerciseId: string) => {
    const exercise = mockActivities.find((ex) => ex.id === exerciseId)
    if (!exercise || !isWritingExercise(exercise)) return

    const userAnswer = selectedAnswers[exerciseId] as string
    if (!userAnswer || !userAnswer.trim()) return

    const result = validateExercise(exercise, userAnswer)

    if (result.isCorrect) {
      playSuccess()
    } else {
      playError()
    }

    setValidationResults({
      ...validationResults,
      [exerciseId]: result,
    })

    const comment = exercise.metadata?.comment as
      | { title: string; content: string; imageUrl?: string }
      | undefined
    setSubmittedAnswers({
      ...submittedAnswers,
      [exerciseId]: { isCorrect: result.isCorrect, userAnswer, comment },
    })
  }

  // Handler para verificar resposta de questão numérica
  const handleVerifyNumeric = (exerciseId: string) => {
    const exercise = mockActivities.find((ex) => ex.id === exerciseId)
    if (!exercise || !isNumericExercise(exercise)) return

    const userAnswer = selectedAnswers[exerciseId] as number
    if (userAnswer === 0 || userAnswer === undefined) return

    const result = validateExercise(exercise, userAnswer)

    if (result.isCorrect) {
      playSuccess()
    } else {
      playError()
    }

    setValidationResults({
      ...validationResults,
      [exerciseId]: result,
    })

    const comment = exercise.metadata?.comment as
      | { title: string; content: string; imageUrl?: string }
      | undefined
    setSubmittedAnswers({
      ...submittedAnswers,
      [exerciseId]: { isCorrect: result.isCorrect, userAnswer, comment },
    })
  }

  // Handler para mudança de resposta em atividade de escrita
  const handleWritingChange = (exerciseId: string, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [exerciseId]: answer,
    })
  }

  // Handler para mudança de resposta em questão numérica
  const handleNumericChange = (exerciseId: string, answer: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [exerciseId]: answer,
    })
  }

  const pagesData: PageData[] = allPages.map((page, index) => {
    const pageNumber = index + 1
    const isLocked = pageNumber > maxReachedIndex + 3
    const isCompleted = visitedPages.includes(pageNumber)

    const content =
      'exercise' in page && page.exercise ? null : parse(page.contentHtml || '')

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

  // Handler para download de material
  const handleDownloadMaterial = async (materialId: string) => {
    try {
      const { url } = await mockSupportMaterialsApi.downloadMaterial(materialId)
      // Simula download abrindo em nova aba
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao baixar material:', error)
    }
  }

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
            {/* Renderiza ContentView para resourceType 'content' */}
            {resourceType === 'content' && !isExercisePage && (
              <ContentView
                key={`${currentPage.id}-${userId || 'loading'}`}
                documentId={`virtual-classroom-page-${currentPage.id}`}
                contentHtml={currentPage.contentHtml || ''}
                disabled={isOtherToolActive}
                repository={highlightRepository}
              />
            )}

            {/* Renderiza MaterialView para resourceType 'material' */}
            {resourceType === 'material' && isMaterialView && (
              <MaterialView
                materials={mockSupportMaterials}
                onDownload={handleDownloadMaterial}
              />
            )}

            {/* Renderiza ActivityView para outros resourceTypes */}
            {resourceType !== 'content' &&
              resourceType !== 'material' &&
              isExercisePage &&
              currentPage.exercise && (
                <ActivityView
                  exercise={currentPage.exercise}
                  currentPageIndex={currentPageIndex}
                  totalPages={totalPages}
                  resourceType={resourceType}
                  selectedAnswer={selectedAnswers[currentPage.exercise.id]}
                  submittedAnswer={submittedAnswers[currentPage.exercise.id]}
                  validationResult={validationResults[currentPage.exercise.id]}
                  onSelectOption={(optionId) =>
                    handleSelectOption(currentPage.exercise!.id, optionId)
                  }
                  onConfirmAnswer={() =>
                    handleConfirmAnswer(currentPage.exercise!.id)
                  }
                  onVerifyWriting={() =>
                    isNumericExercise(currentPage.exercise!)
                      ? handleVerifyNumeric(currentPage.exercise!.id)
                      : handleVerifyWriting(currentPage.exercise!.id)
                  }
                  onWritingChange={(answer) =>
                    handleWritingChange(currentPage.exercise!.id, answer)
                  }
                  onNumericChange={(answer) =>
                    handleNumericChange(currentPage.exercise!.id, answer)
                  }
                />
              )}
          </>
        )}
      </VirtualClassroomLayout>
    </>
  )
}

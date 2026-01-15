import { useState, useEffect, useCallback } from 'react'
import { TOOL_CONFIGS } from '@/features/annotations/types/types'
import type { Stroke, AnnotationConfig } from '@/features/annotations'
import { createFirebaseStrokeRepository } from '@/features/annotations/repositories'

/**
 * Hook para gerenciar anotações (strokes) de uma página usando Firebase
 */
export const useFirebaseAnnotations = (
  pageId: string,
  userId: string | null
) => {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [config, setConfig] = useState<AnnotationConfig>({
    tool: 'pen',
    color: '#000000',
    strokeWidth: TOOL_CONFIGS.pen.defaultWidth,
    opacity: TOOL_CONFIGS.pen.defaultOpacity,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [loadedPageId, setLoadedPageId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carrega strokes do Firebase quando pageId ou userId mudam
  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    const loadStrokes = async () => {
      setIsLoading(true)
      setLoadedPageId(null)

      try {
        const repository = createFirebaseStrokeRepository(userId)
        const loadedStrokes = await repository.findByPageId(pageId)
        setStrokes(loadedStrokes)
        setLoadedPageId(pageId)
      } catch (error) {
        console.error('[useFirebaseAnnotations] Error loading strokes:', error)
        setStrokes([])
      } finally {
        setIsLoading(false)
      }
    }

    loadStrokes()
  }, [pageId, userId])

  // Salva strokes no Firebase quando mudam
  useEffect(() => {
    if (!userId || loadedPageId !== pageId || isLoading) {
      return
    }

    const saveStrokes = async () => {
      try {
        const repository = createFirebaseStrokeRepository(userId)
        await repository.saveAll(pageId, strokes)
      } catch (error) {
        console.error('[useFirebaseAnnotations] Error saving strokes:', error)
      }
    }

    // Debounce para evitar muitas escritas
    const timeoutId = setTimeout(saveStrokes, 500)
    return () => clearTimeout(timeoutId)
  }, [strokes, pageId, userId, loadedPageId, isLoading])

  const clearStrokes = useCallback(() => {
    if (
      !window.confirm(
        'Tem certeza que deseja limpar todas as anotações desta página?'
      )
    ) {
      return
    }

    if (!userId) return

    setStrokes([])

    // Remove do Firebase
    const repository = createFirebaseStrokeRepository(userId)
    repository.deleteByPageId(pageId).catch((error) => {
      console.error('[useFirebaseAnnotations] Error clearing strokes:', error)
    })
  }, [pageId, userId])

  return {
    strokes,
    setStrokes,
    config,
    setConfig,
    isVisible,
    setIsVisible,
    clearStrokes,
    isLoading,
  }
}

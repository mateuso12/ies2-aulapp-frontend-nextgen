import { useState, useEffect, useCallback } from 'react'
import { TOOL_CONFIGS } from '../components/Annotations/types'
import type { Stroke, AnnotationConfig } from '../components/Annotations/types'

export const useAnnotations = (pageId: string, userId: string = 'default-user') => {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [config, setConfig] = useState<AnnotationConfig>({
    tool: 'pen',
    color: '#000000',
    strokeWidth: TOOL_CONFIGS.pen.defaultWidth,
    opacity: TOOL_CONFIGS.pen.defaultOpacity,
  })
  const [isVisible, setIsVisible] = useState(false)
  const [loadedPageId, setLoadedPageId] = useState<string | null>(null)

  // Load strokes
  useEffect(() => {
    setLoadedPageId(null)
    const key = `annotations-${userId}-${pageId}`
    const savedStrokes = localStorage.getItem(key)
    if (savedStrokes) {
      try {
        setStrokes(JSON.parse(savedStrokes))
      } catch (e) {
        console.error('Failed to parse saved strokes', e)
        setStrokes([])
      }
    } else {
      setStrokes([])
    }
    setLoadedPageId(pageId)
  }, [pageId, userId])

  // Save strokes
  useEffect(() => {
    if (loadedPageId === pageId) {
      const key = `annotations-${userId}-${pageId}`
      if (strokes.length > 0) {
        localStorage.setItem(key, JSON.stringify(strokes))
      } else {
        localStorage.removeItem(key)
      }
    }
  }, [strokes, pageId, userId, loadedPageId])

  const clearStrokes = useCallback(() => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar todas as anotações desta página?'
      )
    ) {
      setStrokes([])
      const key = `annotations-${userId}-${pageId}`
      localStorage.removeItem(key)
    }
  }, [pageId, userId])

  return {
    strokes,
    setStrokes,
    config,
    setConfig,
    isVisible,
    setIsVisible,
    clearStrokes,
  }
}

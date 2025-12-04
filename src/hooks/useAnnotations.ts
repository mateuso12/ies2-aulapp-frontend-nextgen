import { useState, useEffect, useCallback } from 'react'
import { TOOL_CONFIGS } from '../components/Annotations/types'
import type { Stroke, AnnotationConfig } from '../components/Annotations/types'

export const useAnnotations = (pageId: string) => {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [config, setConfig] = useState<AnnotationConfig>({
    tool: 'pen',
    color: '#000000',
    strokeWidth: TOOL_CONFIGS.pen.defaultWidth,
    opacity: TOOL_CONFIGS.pen.defaultOpacity,
  })
  const [isVisible, setIsVisible] = useState(false)

  // Load strokes
  useEffect(() => {
    const savedStrokes = localStorage.getItem(`annotations-${pageId}`)
    if (savedStrokes) {
      try {
        setStrokes(JSON.parse(savedStrokes))
      } catch (e) {
        console.error('Failed to parse saved strokes', e)
      }
    } else {
      setStrokes([])
    }
  }, [pageId])

  // Save strokes
  useEffect(() => {
    if (strokes.length > 0) {
      localStorage.setItem(`annotations-${pageId}`, JSON.stringify(strokes))
    }
  }, [strokes, pageId])

  const clearStrokes = useCallback(() => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar todas as anotações desta página?'
      )
    ) {
      setStrokes([])
      localStorage.removeItem(`annotations-${pageId}`)
    }
  }, [pageId])

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

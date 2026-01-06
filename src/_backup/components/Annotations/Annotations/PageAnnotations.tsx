import React, { useState, useEffect } from 'react'
import { DrawingCanvas } from './DrawingCanvas'
import { WritingToolbar } from './WritingToolbar'
import { TOOL_CONFIGS } from './types'
import type { Stroke, AnnotationConfig } from './types'

interface PageAnnotationsProps {
  pageId: string
  isVisible: boolean
  onClose: () => void
}

export const PageAnnotations: React.FC<PageAnnotationsProps> = ({
  pageId,
  isVisible,
  onClose,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [config, setConfig] = useState<AnnotationConfig>({
    tool: 'pen',
    color: '#000000',
    strokeWidth: TOOL_CONFIGS.pen.defaultWidth,
    opacity: TOOL_CONFIGS.pen.defaultOpacity,
  })
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load strokes from localStorage when pageId changes
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

  // Save strokes to localStorage when they change
  useEffect(() => {
    if (strokes.length > 0) {
      localStorage.setItem(`annotations-${pageId}`, JSON.stringify(strokes))
    } else {
      // Optional: remove key if empty? Or keep empty array.
      // localStorage.removeItem(`annotations-${pageId}`)
    }
  }, [strokes, pageId])

  const handleClear = () => {
    if (
      window.confirm(
        'Tem certeza que deseja limpar todas as anotações desta página?'
      )
    ) {
      setStrokes([])
      localStorage.removeItem(`annotations-${pageId}`)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <DrawingCanvas
        width={dimensions.width}
        height={dimensions.height}
        pageId={pageId}
        strokes={strokes}
        currentConfig={config}
        isDrawingMode={isVisible}
        onStrokesChange={setStrokes}
      />

      <div className="pointer-events-auto">
        <WritingToolbar
          currentConfig={config}
          onConfigChange={setConfig}
          onClear={handleClear}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

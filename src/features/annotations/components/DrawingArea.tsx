import React, { useRef, useEffect, useState } from 'react'
import { DrawingCanvas } from './DrawingCanvas'
import type { Stroke, AnnotationConfig } from '../types/types'

interface DrawingAreaProps {
  children: React.ReactNode
  pageId: string
  strokes: Stroke[]
  currentConfig: AnnotationConfig
  isDrawingMode: boolean
  onStrokesChange: (strokes: Stroke[]) => void
  className?: string
}

export const DrawingArea: React.FC<DrawingAreaProps> = ({
  children,
  pageId,
  strokes,
  currentConfig,
  isDrawingMode,
  onStrokesChange,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()

    const observer = new ResizeObserver(updateDimensions)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Drawing Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <DrawingCanvas
          width={dimensions.width}
          height={dimensions.height}
          pageId={pageId}
          strokes={strokes}
          currentConfig={currentConfig}
          isDrawingMode={isDrawingMode}
          onStrokesChange={onStrokesChange}
        />
      </div>
    </div>
  )
}

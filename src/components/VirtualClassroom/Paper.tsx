import React from 'react'
import { DrawingArea } from '../Annotations/DrawingArea'
import type { Stroke, AnnotationConfig } from '../Annotations/types'

interface PaperProps {
  children: React.ReactNode
  pageId: string
  strokes: Stroke[]
  currentConfig: AnnotationConfig
  isDrawingMode: boolean
  onStrokesChange: (strokes: Stroke[]) => void
}

export const Paper: React.FC<PaperProps> = ({
  children,
  pageId,
  strokes,
  currentConfig,
  isDrawingMode,
  onStrokesChange,
}) => {
  return (
    <div className="flex justify-center w-full min-h-full px-12 pb-12 pt-[180px]">
      <DrawingArea
        pageId={pageId}
        strokes={strokes}
        currentConfig={currentConfig}
        isDrawingMode={isDrawingMode}
        onStrokesChange={onStrokesChange}
        className="w-full max-w-[1400px] min-h-[1123px] bg-white shadow-lg rounded-sm overflow-hidden"
      >
        <div className="p-12">{children}</div>
      </DrawingArea>
    </div>
  )
}

import React from 'react'
import { DrawingArea } from '@/features/annotations'
import type { Stroke, AnnotationConfig } from '@/features/annotations'

interface PaperProps {
  children: React.ReactNode
  pageId: string
  strokes: Stroke[]
  currentConfig: AnnotationConfig
  isDrawingMode: boolean
  onStrokesChange: (strokes: Stroke[]) => void
  variant?: 'default' | 'gamified'
}

export const Paper: React.FC<PaperProps> = ({
  children,
  pageId,
  strokes,
  currentConfig,
  isDrawingMode,
  onStrokesChange,
  variant = 'default',
}) => {
  return (
    <div
      className={`flex justify-center w-full min-h-full px-4 md:px-12 pb-20 md:pb-32 ${
        variant === 'gamified' ? 'pt-32 md:pt-32' : 'pt-20 md:pt-32'
      }`}
    >
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

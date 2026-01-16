import React, { forwardRef, type ReactNode } from 'react'
import { motion, type MotionValue } from 'framer-motion'
import { Paper } from '../content/Paper'
import { DrawingArea } from '@/features/annotations'
import { StickyNoteOnCanvas } from '@/features/sticky-notes'
import type { StickyNote } from '@/features/sticky-notes/types'
import type { AnnotationConfig, Stroke } from '@/features/annotations'

interface ContentAreaProps {
  children: ReactNode
  variant: 'default' | 'gamified'
  showPaper: boolean
  enableDrawing: boolean
  pageId: string
  strokes: Stroke[]
  currentConfig: AnnotationConfig
  isDrawingMode: boolean
  onStrokesChange: (strokes: Stroke[]) => void
  bgY: MotionValue<number>
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  stickyNotes: StickyNote[]
  areStickyNotesVisible: boolean
  isMobile: boolean
  onUpdateNote: (note: StickyNote) => void
  onDeleteNote: (id: string) => void
  onOpenSidebar: () => void
}

export const ContentArea = forwardRef<HTMLDivElement, ContentAreaProps>(
  (
    {
      children,
      variant,
      showPaper,
      enableDrawing,
      pageId,
      strokes,
      currentConfig,
      isDrawingMode,
      onStrokesChange,
      bgY,
      onDrop,
      onDragOver,
      stickyNotes,
      areStickyNotesVisible,
      isMobile,
      onUpdateNote,
      onDeleteNote,
      onOpenSidebar,
    },
    ref
  ) => {
    return (
      <main
        ref={ref}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={`flex-1 min-h-0 overflow-auto relative custom-scrollbar ${
          variant === 'gamified' ? '' : 'bg-[#F5F7FB] dark:bg-background'
        }`}
      >
        {variant === 'gamified' && (
          <>
            <div className="fixed inset-0 z-0 bg-[#C6D3F5] dark:bg-(--gamified-bg)" />
            <motion.div
              style={{ y: bgY, scale: 1.1 }}
              className="fixed inset-0 z-0 bg-[url('/imgs/bg_gamified.svg')] bg-cover bg-center opacity-20 dark:opacity-10"
            />
          </>
        )}

        {showPaper ? (
          <div className="relative z-10 min-h-full">
            <Paper
              pageId={pageId}
              strokes={strokes}
              currentConfig={currentConfig}
              isDrawingMode={isDrawingMode}
              onStrokesChange={onStrokesChange}
              variant={variant}
            >
              {children}
            </Paper>
          </div>
        ) : enableDrawing ? (
          <DrawingArea
            pageId={pageId}
            strokes={strokes}
            currentConfig={currentConfig}
            isDrawingMode={isDrawingMode}
            onStrokesChange={onStrokesChange}
            className={`w-full min-h-full flex justify-center px-4 md:px-12 pb-20 md:pb-32 ${
              variant === 'gamified' ? 'pt-32 md:pt-32' : 'pt-20 md:pt-32'
            }`}
          >
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </DrawingArea>
        ) : (
          <div
            className={`w-full min-h-full flex justify-center px-4 md:px-12 pb-20 md:pb-32 ${
              variant === 'gamified' ? 'pt-32 md:pt-32' : 'pt-20 md:pt-32'
            }`}
          >
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </div>
        )}

        {areStickyNotesVisible &&
          !isMobile &&
          stickyNotes.map((note) => (
            <StickyNoteOnCanvas
              key={note.id}
              note={note}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
              onOpenSidebar={onOpenSidebar}
            />
          ))}
      </main>
    )
  }
)

ContentArea.displayName = 'ContentArea'

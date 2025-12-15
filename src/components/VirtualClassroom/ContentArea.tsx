import React, { forwardRef, type ReactNode } from 'react'
import { motion, type MotionValue } from 'framer-motion'
import { Paper } from './Paper'
import { DrawingArea } from '../Annotations/DrawingArea'
import { StickyNoteOnCanvas } from '../StickyNotes/StickyNoteOnCanvas'
import type { StickyNote } from '../StickyNotes/types'
import type { AnnotationConfig, Stroke } from '../Annotations/types'

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
        className={`flex-1 overflow-auto relative custom-scrollbar ${
          variant === 'gamified' ? '' : 'bg-[#F5F7FB]'
        }`}
      >
        {variant === 'gamified' && (
          <>
            <div className="fixed inset-0 z-0 bg-[#C6D3F5]" />
            <motion.div
              style={{ y: bgY, scale: 1.1 }}
              className="fixed inset-0 z-0 bg-[url('/imgs/bg_gamified.svg')] bg-cover bg-center opacity-20"
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
            className="w-full min-h-full flex justify-center pt-[180px] px-12 pb-12"
          >
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </DrawingArea>
        ) : (
          <div className="w-full min-h-full flex justify-center pt-[180px] px-12 pb-12">
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </div>
        )}

        {areStickyNotesVisible &&
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

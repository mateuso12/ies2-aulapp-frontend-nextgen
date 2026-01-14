import type { ReactNode, RefObject } from 'react'
import { AnimatePresence, type MotionValue } from 'framer-motion'
import { SwipeableContentWrapper } from '@/features/virtual-classroom/components/overlays/SwipeableContentWrapper'
import { ContentArea } from '@/features/virtual-classroom/components/layout/ContentArea'
import { WritingToolbar } from '@/features/annotations'
import type { StickyNote } from '@/features/sticky-notes/types'
import type { Stroke, AnnotationConfig } from '@/features/annotations'

interface ContentSectionProps {
  mainRef: RefObject<HTMLDivElement | null>
  variant: 'default' | 'gamified'
  showPaper: boolean
  enableDrawing: boolean
  currentPage: number
  totalPages: number
  strokes: Stroke[]
  config: AnnotationConfig
  isVisible: boolean
  isMobile: boolean
  bgY: MotionValue<number>
  placedNotes: StickyNote[]
  areStickyNotesVisible: boolean
  isOtherToolActive: boolean
  children: ReactNode | ((props: { isOtherToolActive: boolean }) => ReactNode)
  onNext?: () => void
  onPrevious?: () => void
  onStrokesChange: (strokes: Stroke[]) => void
  onConfigChange: (config: AnnotationConfig) => void
  onClearStrokes: () => void
  onCloseToolbar: () => void
  onUpdateNote: (note: StickyNote) => void
  onDeleteNote: (id: string) => void
  onOpenSidebar: () => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
}

export function ContentSection({
  mainRef,
  variant,
  showPaper,
  enableDrawing,
  currentPage,
  totalPages,
  strokes,
  config,
  isVisible,
  isMobile,
  bgY,
  placedNotes,
  areStickyNotesVisible,
  isOtherToolActive,
  children,
  onNext,
  onPrevious,
  onStrokesChange,
  onConfigChange,
  onClearStrokes,
  onCloseToolbar,
  onUpdateNote,
  onDeleteNote,
  onOpenSidebar,
  onDrop,
  onDragOver,
}: ContentSectionProps) {
  return (
    <>
      {/* Área de conteúdo com suporte a swipe (mobile) - ocupa toda a altura da viewport */}
      <SwipeableContentWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={onNext}
        onPrevious={onPrevious}
        enabled={isMobile}
      >
        <ContentArea
          ref={mainRef}
          variant={variant}
          showPaper={showPaper}
          enableDrawing={enableDrawing}
          pageId={`page-${currentPage}`}
          strokes={strokes}
          currentConfig={config}
          isDrawingMode={isVisible && enableDrawing}
          onStrokesChange={onStrokesChange}
          bgY={bgY}
          onDrop={onDrop}
          onDragOver={onDragOver}
          stickyNotes={placedNotes}
          areStickyNotesVisible={areStickyNotesVisible}
          isMobile={isMobile}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          onOpenSidebar={onOpenSidebar}
        >
          {typeof children === 'function'
            ? children({ isOtherToolActive })
            : children}
        </ContentArea>
      </SwipeableContentWrapper>

      <AnimatePresence>
        {enableDrawing && isVisible && (
          <WritingToolbar
            currentConfig={config}
            onConfigChange={onConfigChange}
            onClear={onClearStrokes}
            onClose={onCloseToolbar}
          />
        )}
      </AnimatePresence>
    </>
  )
}

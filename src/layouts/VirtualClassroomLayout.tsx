import React, {
  type ReactNode,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { Header } from '../components/VirtualClassroom/Header'
import { Footer } from '../components/VirtualClassroom/Footer'
import { WritingToolbar } from '../components/Annotations/WritingToolbar'
import { useAnnotations } from '../hooks/useAnnotations'
import { useScroll, useTransform, AnimatePresence } from 'framer-motion'
import type { PageData } from '../components/VirtualClassroom/PageReel'
import { BookmarksSidebar } from '../components/VirtualClassroom/BookmarksSidebar'
import { StickyNoteSidebar } from '../components/StickyNotes/StickyNoteSidebar'
import { useStickyNotes } from '../hooks/useStickyNotes'
import { ContentArea } from '../components/VirtualClassroom/ContentArea'
import { DevTools } from '../components/VirtualClassroom/DevTools'
import { FloatingBookmarkButton } from '../components/VirtualClassroom/FloatingBookmarkButton'

export type ResourceType =
  | 'content'
  | 'exercise_list'
  | 'gamified'
  | 'assessment'
  | 'scorm'
  | 'simulation'
  | 'material'

interface VirtualClassroomLayoutProps {
  children: ReactNode
  variant?: 'default' | 'gamified'
  resourceType?: ResourceType | string
  currentPage?: number
  totalPages?: number
  pages?: PageData[]
  bookmarks?: number[]
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
  onToggleBookmark?: (page: number) => void
  onRemoveBookmark?: (page: number) => void
}

export const VirtualClassroomLayout: React.FC<VirtualClassroomLayoutProps> = ({
  children,
  variant: initialVariant = 'default',
  resourceType: initialResourceType = 'content',
  currentPage = 1,
  totalPages = 1,
  pages = [],
  bookmarks = [],
  onNext,
  onPrevious,
  onPageSelect,
  onToggleBookmark,
  onRemoveBookmark,
}) => {
  const [variant, setVariant] = useState(initialVariant)
  const [resourceType, setResourceType] = useState(initialResourceType)
  const [isBookmarksSidebarOpen, setIsBookmarksSidebarOpen] = useState(false)

  useEffect(() => {
    setVariant(initialVariant)
    setResourceType(initialResourceType)
  }, [initialVariant, initialResourceType])

  const {
    strokes,
    setStrokes,
    config,
    setConfig,
    isVisible,
    setIsVisible,
    clearStrokes,
  } = useAnnotations(`page-${currentPage}`, 'user-1')

  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: mainRef })
  const bgY = useTransform(scrollY, [0, 1000], [0, 200])

  const {
    stickyNotes,
    isSidebarOpen: isStickyNoteSidebarOpen,
    setIsSidebarOpen: setIsStickyNoteSidebarOpen,
    areNotesVisible: areStickyNotesVisible,
    setAreNotesVisible: setAreStickyNotesVisible,
    addNote,
    updateNote,
    deleteNote,
    goToNote,
    handleDrop,
    handleDragOver,
  } = useStickyNotes({
    currentPage,
    onPageSelect,
    mainRef,
  })

  const isContent = resourceType === 'content' || resourceType === 'material'
  const showPaper = variant === 'gamified'
  const enableDrawing = isContent
  const isCurrentPageBookmarked = bookmarks.includes(currentPage)

  const handleBookmarkClick = () => {
    if (!isCurrentPageBookmarked) {
      onToggleBookmark?.(currentPage)
    }
    setIsBookmarksSidebarOpen(true)
    setIsStickyNoteSidebarOpen(false)
    setIsVisible(false)
  }

  const currentNotes = useMemo(
    () => stickyNotes.filter((n) => n.page === currentPage && n.isPlaced),
    [stickyNotes, currentPage]
  )

  // Enhance pages with drawing status from localStorage/state
  const enhancedPages = useMemo(() => {
    return pages.map((page, index) => {
      const pageNum = index + 1
      const storageKey = `annotations-user-1-page-${pageNum}`
      let hasStoredDrawings = false
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredDrawings = Array.isArray(parsed) && parsed.length > 0
        }
      } catch {
        // Ignore storage errors
      }

      const isCurrentPage = pageNum === currentPage
      const hasDrawings = isCurrentPage ? strokes.length > 0 : hasStoredDrawings
      const hasStickyNotes = stickyNotes.some((n) => n.page === pageNum)

      return {
        ...page,
        hasDrawings,
        hasAnnotations: hasStickyNotes,
      }
    })
  }, [pages, currentPage, strokes.length, stickyNotes])

  const handleResourceTypeChange = (type: string) => {
    setResourceType(type)
    if (type === 'gamified') {
      setVariant('gamified')
    } else {
      setVariant('default')
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      <Header
        variant={variant}
        currentPage={currentPage}
        totalPages={totalPages}
        resourceType={resourceType}
      />

      <BookmarksSidebar
        isOpen={isBookmarksSidebarOpen}
        onClose={() => setIsBookmarksSidebarOpen(false)}
        bookmarks={bookmarks}
        currentPage={currentPage}
        onRemoveBookmark={(page) => onRemoveBookmark?.(page)}
        onNavigate={(page) => onPageSelect?.(page)}
      />

      <FloatingBookmarkButton
        isBookmarked={isCurrentPageBookmarked}
        onClick={handleBookmarkClick}
        isVisible={isContent}
      />

      <ContentArea
        ref={mainRef}
        variant={variant}
        showPaper={showPaper}
        enableDrawing={enableDrawing}
        pageId={`page-${currentPage}`}
        strokes={strokes}
        currentConfig={config}
        isDrawingMode={isVisible && enableDrawing}
        onStrokesChange={setStrokes}
        bgY={bgY}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        stickyNotes={currentNotes}
        areStickyNotesVisible={areStickyNotesVisible}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
        onOpenSidebar={() => {
          setIsStickyNoteSidebarOpen(true)
          setIsBookmarksSidebarOpen(false)
          setIsVisible(false)
        }}
      >
        {children}
      </ContentArea>

      <AnimatePresence>
        {enableDrawing && isVisible && (
          <WritingToolbar
            currentConfig={config}
            onConfigChange={setConfig}
            onClear={clearStrokes}
            onClose={() => setIsVisible(false)}
          />
        )}
      </AnimatePresence>

      <Footer
        onToggleAnnotations={() => {
          if (!isVisible) {
            setIsStickyNoteSidebarOpen(false)
            setIsBookmarksSidebarOpen(false)
          }
          setIsVisible(!isVisible)
        }}
        isAnnotationsVisible={isVisible}
        resourceType={resourceType}
        currentPage={currentPage}
        totalPages={totalPages}
        pages={enhancedPages}
        onNext={onNext}
        onPrevious={onPrevious}
        onPageSelect={onPageSelect}
        onToggleStickyNotes={() => {
          if (!isStickyNoteSidebarOpen) {
            setIsVisible(false)
            setIsBookmarksSidebarOpen(false)
          }
          setIsStickyNoteSidebarOpen(!isStickyNoteSidebarOpen)
        }}
        isStickyNotesOpen={isStickyNoteSidebarOpen}
      />

      <StickyNoteSidebar
        isOpen={isStickyNoteSidebarOpen}
        onClose={() => setIsStickyNoteSidebarOpen(false)}
        notes={stickyNotes}
        onAddNote={addNote}
        onEditNote={(note) => {
          if (note.page !== currentPage && onPageSelect) {
            onPageSelect(note.page)
          }
          updateNote({ ...note, isMinimized: false })
        }}
        onDeleteNote={deleteNote}
        onGoToNote={goToNote}
        onToggleVisibility={() =>
          setAreStickyNotesVisible(!areStickyNotesVisible)
        }
        areNotesVisible={areStickyNotesVisible}
      />

      <DevTools
        resourceType={resourceType}
        onResourceTypeChange={handleResourceTypeChange}
      />
    </div>
  )
}

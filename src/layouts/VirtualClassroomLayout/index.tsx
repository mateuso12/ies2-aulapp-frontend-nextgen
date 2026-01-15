import { useRef, useState, useEffect, useMemo } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { MobileSearchOverlay } from '@/features/virtual-classroom/components/overlays/MobileSearchOverlay'
import { useUser } from '@/hooks/useUser'
import { useFirebaseAnnotations } from '@/hooks/useFirebaseAnnotations'
import { useAutoHideBars } from '@/hooks/useAutoHideBars'
import { useImmersiveReadingMode } from '@/hooks/useImmersiveReadingMode'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useFirebaseStickyNotes } from '@/hooks/useFirebaseStickyNotes'
import { HeaderSection } from './HeaderSection'
import { FooterSection } from './FooterSection'
import { ContentSection } from './ContentSection'
import { FloatingButtons } from './FloatingButtons'
import { SidebarsSection } from './SidebarsSection'
import type { VirtualClassroomLayoutProps } from './types'

export function VirtualClassroomLayout({
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
}: VirtualClassroomLayoutProps) {
  // State management
  const [variant, setVariant] = useState(initialVariant)
  const [resourceType, setResourceType] = useState(initialResourceType)
  const [isBookmarksSidebarOpen, setIsBookmarksSidebarOpen] = useState(false)
  const [isBarsAutoHidden, setIsBarsAutoHidden] = useState(false)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [isFooterHovered, setIsFooterHovered] = useState(false)
  const [isFooterInteracting, setIsFooterInteracting] = useState(false)
  const [isFooterMenusOpen, setIsFooterMenusOpen] = useState(false)
  const [isHeaderMenusOpen, setIsHeaderMenusOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isFocusModeActive, setIsFocusModeActive] = useState(false)
  const [highlightsTrigger, setHighlightsTrigger] = useState(0)

  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  // User data
  const { userId } = useUser()

  // Handlers
  const openMobileSearch = () => setIsMobileSearchOpen(true)
  const closeMobileSearch = () => setIsMobileSearchOpen(false)
  const toggleFocusMode = () => setIsFocusModeActive(!isFocusModeActive)

  // Lock global quando qualquer menu/ferramenta estiver aberta
  const lockVisible = isHeaderMenusOpen || isFooterMenusOpen

  useEffect(() => {
    setVariant(initialVariant)
    setResourceType(initialResourceType)
  }, [initialVariant, initialResourceType])

  // Listen to localStorage changes for highlights
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('aulapp:highlights:')) {
        setHighlightsTrigger((prev) => prev + 1)
      }
    }

    const handleCustomStorageChange = () => {
      setHighlightsTrigger((prev) => prev + 1)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('highlightsChanged', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('highlightsChanged', handleCustomStorageChange)
    }
  }, [])

  // Hooks
  const { isRevealed: isBarsRevealed } = useAutoHideBars({
    enabled: isBarsAutoHidden,
    lockVisible,
    isHeaderHovered,
    isFooterHovered,
    isFooterInteracting,
  })

  const {
    strokes,
    setStrokes,
    config,
    setConfig,
    isVisible,
    setIsVisible,
    clearStrokes,
  } = useFirebaseAnnotations(`page-${currentPage}`, userId)

  const { isUiHidden, reveal: revealImmersiveUi } = useImmersiveReadingMode({
    enabled: true,
    lockVisible,
    isBusy: isVisible,
  })

  useEffect(() => {
    if (lockVisible) {
      revealImmersiveUi()
    }
  }, [lockVisible, revealImmersiveUi])

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
  } = useFirebaseStickyNotes({
    currentPage,
    onPageSelect,
    mainRef,
    userId,
  })

  // Computed values
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
    () => stickyNotes.filter((n) => n.page === currentPage),
    [stickyNotes, currentPage]
  )

  const placedNotes = useMemo(
    () => currentNotes.filter((n) => n.isPlaced),
    [currentNotes]
  )

  const hasCurrentPageHighlights = useMemo(() => {
    const highlightKey = `aulapp:highlights:virtual-classroom-page-${currentPage}`
    try {
      const stored = localStorage.getItem(highlightKey)
      if (!stored) return false
      const highlights = JSON.parse(stored)
      return Array.isArray(highlights) && highlights.length > 0
    } catch {
      return false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, highlightsTrigger])

  const enhancedPages = useMemo(() => {
    return pages.map((page, index) => {
      const pageNum = index + 1
      const storageKey = `annotations-user-1-page-${pageNum}`
      const highlightKey = `aulapp:highlights:virtual-classroom-page-${pageNum}`

      let hasStoredDrawings = false
      let hasStoredHighlights = false

      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredDrawings = Array.isArray(parsed) && parsed.length > 0
        }
      } catch {
        // Ignore
      }

      try {
        const stored = localStorage.getItem(highlightKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredHighlights = Array.isArray(parsed) && parsed.length > 0
        }
      } catch {
        // Ignore
      }

      const isCurrentPage = pageNum === currentPage
      const hasDrawings = isCurrentPage ? strokes.length > 0 : hasStoredDrawings
      const hasHighlights = isCurrentPage
        ? hasCurrentPageHighlights
        : hasStoredHighlights
      const hasStickyNotes = stickyNotes.some((n) => n.page === pageNum)

      return {
        ...page,
        hasDrawings,
        hasHighlights,
        hasAnnotations: hasStickyNotes,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pages,
    currentPage,
    strokes.length,
    stickyNotes,
    hasCurrentPageHighlights,
    highlightsTrigger,
  ])

  const isHeaderHidden =
    isFocusModeActive || isUiHidden || (isBarsAutoHidden && !isBarsRevealed)
  const isFooterHidden =
    isFocusModeActive || isUiHidden || (isBarsAutoHidden && !isBarsRevealed)

  const handleToggleAnnotations = () => {
    if (!isVisible) {
      setIsStickyNoteSidebarOpen(false)
      setIsBookmarksSidebarOpen(false)
    }
    setIsVisible(!isVisible)
  }

  const handleToggleStickyNotes = () => {
    if (!isStickyNoteSidebarOpen) {
      setIsVisible(false)
      setIsBookmarksSidebarOpen(false)
    }
    setIsStickyNoteSidebarOpen(!isStickyNoteSidebarOpen)
  }

  const handleEditNote = (note: (typeof stickyNotes)[0]) => {
    if (note.page !== currentPage && onPageSelect) {
      onPageSelect(note.page)
    }
    updateNote({ ...note, isMinimized: false })
  }

  const handleOpenSidebar = () => {
    setIsStickyNoteSidebarOpen(true)
    setIsBookmarksSidebarOpen(false)
    setIsVisible(false)
  }

  const isOtherToolActive =
    isVisible ||
    isStickyNoteSidebarOpen ||
    isBookmarksSidebarOpen ||
    isMobileSearchOpen

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={closeMobileSearch}
        resultsCount={2}
      />

      <HeaderSection
        variant={variant}
        currentPage={currentPage}
        totalPages={totalPages}
        resourceType={resourceType}
        isHeaderHidden={isHeaderHidden}
        isBarsAutoHidden={isBarsAutoHidden}
        isCurrentPageBookmarked={isCurrentPageBookmarked}
        currentNotesCount={currentNotes.length}
        strokesCount={strokes.length}
        hasCurrentPageHighlights={hasCurrentPageHighlights}
        onHeaderHovered={setIsHeaderHovered}
        onBookmarkClick={handleBookmarkClick}
        onMenusOpenChange={setIsHeaderMenusOpen}
        onToggleStickyNotes={handleToggleStickyNotes}
        onToggleAnnotations={handleToggleAnnotations}
      />

      <SidebarsSection
        isBookmarksSidebarOpen={isBookmarksSidebarOpen}
        isStickyNoteSidebarOpen={isStickyNoteSidebarOpen}
        bookmarks={bookmarks}
        stickyNotes={stickyNotes}
        currentPage={currentPage}
        areStickyNotesVisible={areStickyNotesVisible}
        onCloseBookmarks={() => setIsBookmarksSidebarOpen(false)}
        onCloseStickyNotes={() => setIsStickyNoteSidebarOpen(false)}
        onRemoveBookmark={(page) => onRemoveBookmark?.(page)}
        onNavigateToPage={(page) => onPageSelect?.(page)}
        onAddNote={addNote}
        onEditNote={handleEditNote}
        onDeleteNote={deleteNote}
        onGoToNote={goToNote}
        onToggleNotesVisibility={() =>
          setAreStickyNotesVisible(!areStickyNotesVisible)
        }
      />

      <FloatingButtons
        isContent={isContent}
        isCurrentPageBookmarked={isCurrentPageBookmarked}
        isFocusModeActive={isFocusModeActive}
        isMobile={isMobile}
        onBookmarkClick={handleBookmarkClick}
        onToggleFocusMode={toggleFocusMode}
      />

      <ContentSection
        mainRef={mainRef}
        variant={variant}
        showPaper={showPaper}
        enableDrawing={enableDrawing}
        currentPage={currentPage}
        totalPages={totalPages}
        strokes={strokes}
        config={config}
        isVisible={isVisible}
        isMobile={isMobile}
        bgY={bgY}
        placedNotes={placedNotes}
        areStickyNotesVisible={areStickyNotesVisible}
        isOtherToolActive={isOtherToolActive}
        onNext={onNext}
        onPrevious={onPrevious}
        onStrokesChange={setStrokes}
        onConfigChange={setConfig}
        onClearStrokes={clearStrokes}
        onCloseToolbar={() => setIsVisible(false)}
        onUpdateNote={updateNote}
        onDeleteNote={deleteNote}
        onOpenSidebar={handleOpenSidebar}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {children}
      </ContentSection>

      <FooterSection
        variant={variant}
        resourceType={resourceType}
        currentPage={currentPage}
        totalPages={totalPages}
        enhancedPages={enhancedPages}
        isFooterHidden={isFooterHidden}
        isBarsAutoHidden={isBarsAutoHidden}
        isVisible={isVisible}
        isStickyNoteSidebarOpen={isStickyNoteSidebarOpen}
        isFocusModeActive={isFocusModeActive}
        onNext={onNext}
        onPrevious={onPrevious}
        onPageSelect={onPageSelect}
        onFooterHovered={setIsFooterHovered}
        onToggleAnnotations={handleToggleAnnotations}
        onToggleStickyNotes={handleToggleStickyNotes}
        onBookmarkClick={handleBookmarkClick}
        onSearchInPage={openMobileSearch}
        onToggleBarsAutoHidden={() => setIsBarsAutoHidden((v) => !v)}
        onFooterInteracting={setIsFooterInteracting}
        onFooterMenusOpen={setIsFooterMenusOpen}
        onToggleFocusMode={toggleFocusMode}
      />
    </div>
  )
}

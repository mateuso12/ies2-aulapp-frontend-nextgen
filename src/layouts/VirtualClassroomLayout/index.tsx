import { useRef, useState, useEffect, useMemo } from 'react'
import { useScroll, useTransform } from 'framer-motion'
import { MobileSearchOverlay } from '@/features/virtual-classroom/components/overlays/MobileSearchOverlay'
import { useUser } from '@/hooks/useUser'
import { useFirebaseAnnotations } from '@/hooks/useFirebaseAnnotations'
import { useAutoHideBars } from '@/hooks/useAutoHideBars'
import { useImmersiveReadingMode } from '@/hooks/useImmersiveReadingMode'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useFirebaseStickyNotes } from '@/hooks/useFirebaseStickyNotes'
import { createFirebaseHighlightRepository } from '@/features/annotations/highlighting/repositories'
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
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [highlightsByPage, setHighlightsByPage] = useState<Record<number, boolean>>({})
  const [drawingsByPage, setDrawingsByPage] = useState<Record<number, boolean>>({})

  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { userId } = useUser()

  const openMobileSearch = () => setIsMobileSearchOpen(true)
  const closeMobileSearch = () => setIsMobileSearchOpen(false)
  const toggleFocusMode = () => setIsFocusModeActive(!isFocusModeActive)

  const lockVisible = isHeaderMenusOpen || isFooterMenusOpen

  useEffect(() => {
    setVariant(initialVariant)
    setResourceType(initialResourceType)
  }, [initialVariant, initialResourceType])

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

  useEffect(() => {
    if (!userId || totalPages === 0) return

    const loadHighlightsForAllPages = async () => {
      const repository = createFirebaseHighlightRepository(userId)
      const highlightsMap: Record<number, boolean> = {}

      for (let i = 1; i <= totalPages; i++) {
        const documentId = `virtual-classroom-page-${i}`
        try {
          const highlights = await repository.findByDocumentId(documentId)
          highlightsMap[i] = highlights.length > 0
        } catch (error) {
          console.error(`Error loading highlights for page ${i}:`, error)
          highlightsMap[i] = false
        }
      }

      setHighlightsByPage(highlightsMap)
    }

    loadHighlightsForAllPages()
  }, [userId, totalPages, highlightsTrigger])

  useEffect(() => {
    if (!userId || totalPages === 0) return

    const loadDrawingsForAllPages = async () => {
      const { createFirebaseStrokeRepository } = await import(
        '@/features/annotations/repositories'
      )
      const repository = createFirebaseStrokeRepository(userId)
      const drawingsMap: Record<number, boolean> = {}

      for (let i = 1; i <= totalPages; i++) {
        const pageId = `page-${i}`
        try {
          const strokes = await repository.findByPageId(pageId)
          drawingsMap[i] = strokes.length > 0
        } catch (error) {
          console.error(`Error loading drawings for page ${i}:`, error)
          drawingsMap[i] = false
        }
      }

      setDrawingsByPage(drawingsMap)
    }

    loadDrawingsForAllPages()
  }, [userId, totalPages, strokes.length])

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

  useEffect(() => {
    if (variant !== 'gamified' || !isMobile) {
      setIsHeaderCollapsed(false)
      return
    }

    const mainElement = mainRef.current
    if (!mainElement) return

    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = mainElement.scrollTop

      if (currentScrollY <= 50) {
        setIsHeaderCollapsed(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderCollapsed(true)
      } else if (currentScrollY < lastScrollY - 10) {
        setIsHeaderCollapsed(false)
      }

      lastScrollY = currentScrollY
    }

    mainElement.addEventListener('scroll', handleScroll, { passive: true })
    return () => mainElement.removeEventListener('scroll', handleScroll)
  }, [variant, isMobile])

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
    return highlightsByPage[currentPage] || false
  }, [currentPage, highlightsByPage])

  const enhancedPages = useMemo(() => {
    return pages.map((page, index) => {
      const pageNum = index + 1

      const isCurrentPage = pageNum === currentPage
      const hasDrawings = isCurrentPage 
        ? strokes.length > 0 
        : drawingsByPage[pageNum] || false
      const hasHighlights = highlightsByPage[pageNum] || false
      const hasStickyNotes = stickyNotes.some((n) => n.page === pageNum)

      return {
        ...page,
        hasDrawings,
        hasHighlights,
        hasAnnotations: hasStickyNotes,
      }
    })
  }, [
    pages,
    currentPage,
    strokes.length,
    stickyNotes,
    highlightsByPage,
    drawingsByPage,
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
        isHeaderCollapsed={isHeaderCollapsed}
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

      {/* FloatingButtons ocultos quando resourceType === 'material' */}
      {resourceType !== 'material' && (
        <FloatingButtons
          isContent={isContent}
          isCurrentPageBookmarked={isCurrentPageBookmarked}
          isFocusModeActive={isFocusModeActive}
          isMobile={isMobile}
          onBookmarkClick={handleBookmarkClick}
          onToggleFocusMode={toggleFocusMode}
        />
      )}

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

      {/* Footer oculto quando resourceType === 'material' */}
      {resourceType !== 'material' && (
        <FooterSection
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
      )}
    </div>
  )
}

import React, {
  type ReactNode,
  useRef,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { Minimize2 } from 'lucide-react'
import { Header } from '@/features/virtual-classroom/components/layout/Header'
import { Footer } from '@/features/virtual-classroom/components/layout/Footer'
import { WritingToolbar } from '@/features/annotations'
import { useAnnotations } from '../hooks/useAnnotations'
import { useScroll, useTransform, AnimatePresence } from 'framer-motion'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'
import { BookmarksSidebar } from '@/features/virtual-classroom/components/overlays/BookmarksSidebar'
import { StickyNoteSidebar } from '@/features/sticky-notes'
import { useStickyNotes } from '../hooks/useStickyNotes'
import { ContentArea } from '@/features/virtual-classroom/components/layout/ContentArea'
import { FloatingBookmarkButton } from '@/features/virtual-classroom/components/overlays/FloatingBookmarkButton'
import { useAutoHideBars } from '../hooks/useAutoHideBars'
import { useImmersiveReadingMode } from '../hooks/useImmersiveReadingMode'
import { useMediaQuery } from '../hooks/use-media-query'
import { SwipeableContentWrapper } from '@/features/virtual-classroom/components/overlays/SwipeableContentWrapper'
import { MobileSearchOverlay } from '@/features/virtual-classroom/components/overlays/MobileSearchOverlay'

export type ResourceType =
  | 'content'
  | 'exercise_list'
  | 'gamified'
  | 'assessment'
  | 'scorm'
  | 'simulation'
  | 'material'

interface VirtualClassroomLayoutProps {
  children: ReactNode | ((props: { isOtherToolActive: boolean }) => ReactNode)
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
  const [isBarsAutoHidden, setIsBarsAutoHidden] = useState(false)
  const [isHeaderHovered, setIsHeaderHovered] = useState(false)
  const [isFooterHovered, setIsFooterHovered] = useState(false)
  const [isFooterInteracting, setIsFooterInteracting] = useState(false)
  const [isFooterMenusOpen, setIsFooterMenusOpen] = useState(false)
  const [isHeaderMenusOpen, setIsHeaderMenusOpen] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isFocusModeActive, setIsFocusModeActive] = useState(false)

  const openMobileSearch = () => setIsMobileSearchOpen(true)
  const closeMobileSearch = () => setIsMobileSearchOpen(false)

  const toggleFocusMode = () => {
    setIsFocusModeActive(!isFocusModeActive)
  }

  // Lock global quando qualquer menu/ferramenta estiver aberta
  const lockVisible = isHeaderMenusOpen || isFooterMenusOpen

  useEffect(() => {
    setVariant(initialVariant)
    setResourceType(initialResourceType)
  }, [initialVariant, initialResourceType])

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
  } = useAnnotations(`page-${currentPage}`, 'user-1')

  // Modo leitura (mobile): toque no centro alterna visibilidade das barras.
  // Respeita lockVisible (menus/ferramentas abertas).
  // DESABILITADO: o overlay bloqueia seleção de texto e scroll
  const { isUiHidden, reveal: revealImmersiveUi } = useImmersiveReadingMode({
    enabled: true,
    lockVisible,
    isBusy: isVisible, // desenho/anotações em uso
  })

  useEffect(() => {
    if (lockVisible) {
      revealImmersiveUi()
    }
  }, [lockVisible, revealImmersiveUi])

  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

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
    () => stickyNotes.filter((n) => n.page === currentPage),
    [stickyNotes, currentPage]
  )

  // Notas colocadas visualmente na página (para renderização)
  const placedNotes = useMemo(
    () => currentNotes.filter((n) => n.isPlaced),
    [currentNotes]
  )

  // Verifica se há highlights (marcações de texto) na página atual
  const hasCurrentPageHighlights = useMemo(() => {
    const highlightKey = `aulapp:highlights:page-${currentPage}`
    try {
      const stored = localStorage.getItem(highlightKey)
      if (!stored) return false
      const highlights = JSON.parse(stored)
      return Array.isArray(highlights) && highlights.length > 0
    } catch {
      return false
    }
  }, [currentPage])

  // Enhance pages with drawing status from localStorage/state
  const enhancedPages = useMemo(() => {
    return pages.map((page, index) => {
      const pageNum = index + 1
      const storageKey = `annotations-user-1-page-${pageNum}`
      const highlightKey = `aulapp:highlights:page-${pageNum}`

      let hasStoredDrawings = false
      let hasStoredHighlights = false

      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredDrawings = Array.isArray(parsed) && parsed.length > 0
        }
      } catch {
        // Ignore storage errors
      }

      try {
        const stored = localStorage.getItem(highlightKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          hasStoredHighlights = Array.isArray(parsed) && parsed.length > 0
        }
      } catch {
        // Ignore storage errors
      }

      const isCurrentPage = pageNum === currentPage
      const hasDrawings = isCurrentPage
        ? strokes.length > 0 || hasCurrentPageHighlights
        : hasStoredDrawings || hasStoredHighlights
      const hasStickyNotes = stickyNotes.some((n) => n.page === pageNum)

      return {
        ...page,
        hasDrawings,
        hasAnnotations: hasStickyNotes,
      }
    })
  }, [
    pages,
    currentPage,
    strokes.length,
    stickyNotes,
    hasCurrentPageHighlights,
  ])

  // Determine visibility state for bars
  // Modo foco manual tem prioridade sobre outros estados
  const isHeaderHidden =
    isFocusModeActive || isUiHidden || (isBarsAutoHidden && !isBarsRevealed)
  const isFooterHidden =
    isFocusModeActive || isUiHidden || (isBarsAutoHidden && !isBarsRevealed)

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={isMobileSearchOpen}
        onClose={closeMobileSearch}
        resultsCount={2}
      />

      {/* Hotspot (mobile) para toque central alternar modo leitura - DESABILITADO
          pois bloqueia seleção de texto e scroll. Modo de leitura pode ser ativado
          por outros meios (botões, gestos específicos, etc).
      <div className="fixed inset-0 z-40 pointer-events-none md:hidden">
        <div
          className="absolute left-0 right-0 top-1/3 h-1/3 pointer-events-auto"
          {...overlayProps}
        />
      </div>
      */}

      <div
        className={`fixed left-0 top-0 z-50 w-full transform-gpu transition-transform duration-300 ease-out ${
          isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
        onMouseEnter={() => isBarsAutoHidden && setIsHeaderHovered(true)}
        onMouseLeave={() => isBarsAutoHidden && setIsHeaderHovered(false)}
      >
        <Header
          variant={variant}
          title="Nome do conteúdo"
          currentPage={currentPage}
          totalPages={totalPages}
          resourceType={resourceType}
          onBookmark={handleBookmarkClick}
          isBookmarked={isCurrentPageBookmarked}
          onMenusOpenChange={setIsHeaderMenusOpen}
          hasCurrentPageNotes={currentNotes.length > 0}
          hasCurrentPageAnnotations={
            strokes.length > 0 || hasCurrentPageHighlights
          }
          onToggleStickyNotes={() => {
            if (!isStickyNoteSidebarOpen) {
              setIsVisible(false)
              setIsBookmarksSidebarOpen(false)
            }
            setIsStickyNoteSidebarOpen(!isStickyNoteSidebarOpen)
          }}
          onToggleAnnotations={() => {
            if (!isVisible) {
              setIsStickyNoteSidebarOpen(false)
              setIsBookmarksSidebarOpen(false)
            }
            setIsVisible(!isVisible)
          }}
        />
      </div>

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

      {/* Botão flutuante para sair do modo foco (mobile) */}
      {isFocusModeActive && isMobile && (
        <button
          onClick={toggleFocusMode}
          className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95"
          aria-label="Sair da tela cheia"
          title="Sair da tela cheia"
        >
          <Minimize2 size={18} />
        </button>
      )}

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
          onStrokesChange={setStrokes}
          bgY={bgY}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          stickyNotes={placedNotes}
          areStickyNotesVisible={areStickyNotesVisible}
          onUpdateNote={updateNote}
          onDeleteNote={deleteNote}
          onOpenSidebar={() => {
            setIsStickyNoteSidebarOpen(true)
            setIsBookmarksSidebarOpen(false)
            setIsVisible(false)
          }}
        >
          {typeof children === 'function'
            ? children({
                isOtherToolActive:
                  isVisible ||
                  isStickyNoteSidebarOpen ||
                  isBookmarksSidebarOpen ||
                  isMobileSearchOpen,
              })
            : children}
        </ContentArea>
      </SwipeableContentWrapper>

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

      <div
        className={`fixed bottom-0 left-0 z-50 w-full transform-gpu transition-transform duration-300 ease-out ${
          isFooterHidden ? 'translate-y-full' : 'translate-y-0'
        }`}
        onMouseEnter={() => isBarsAutoHidden && setIsFooterHovered(true)}
        onMouseLeave={() => isBarsAutoHidden && setIsFooterHovered(false)}
      >
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
          onBookmarkCurrentPage={handleBookmarkClick}
          onSearchInPage={openMobileSearch}
          onMarkText={() => {
            if (!isVisible) {
              setIsStickyNoteSidebarOpen(false)
              setIsBookmarksSidebarOpen(false)
            }
            setIsVisible(!isVisible)
          }}
          onMakeNote={() => {
            if (!isStickyNoteSidebarOpen) {
              setIsVisible(false)
              setIsBookmarksSidebarOpen(false)
            }
            setIsStickyNoteSidebarOpen(true)
          }}
          onHideToolbar={() => {
            setIsBarsAutoHidden((v) => !v)
          }}
          onInteractiveStateChange={setIsFooterInteracting}
          onMenusOpenChange={setIsFooterMenusOpen}
          isFocusModeActive={isFocusModeActive}
          onToggleFocusMode={toggleFocusMode}
        />
      </div>

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
      {/* 
      <DevTools
        resourceType={resourceType}
        onResourceTypeChange={handleResourceTypeChange}
      /> */}
    </div>
  )
}

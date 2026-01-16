import { useState, useEffect } from 'react'
import { PageReel, type PageData } from '../../content/PageReel'
import { MobileFooterContent } from './MobileFooterContent'
import { DesktopFooterContent } from './DesktopFooterContent'
import { DesktopSettingsSection } from './DesktopSettingsSection'

export interface FooterProps {
  onToggleAnnotations?: () => void
  isAnnotationsVisible?: boolean
  onToggleStickyNotes?: () => void
  isStickyNotesOpen?: boolean
  onBookmarkCurrentPage?: () => void
  onSearchInPage?: () => void
  onMarkText?: () => void
  onMakeNote?: () => void
  onOpenSettings?: () => void
  onHideToolbar?: () => void
  resourceType?: string
  currentPage?: number
  totalPages?: number
  pages?: PageData[]
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
  onInteractiveStateChange?: (isInteracting: boolean) => void
  onMenusOpenChange?: (isOpen: boolean) => void
  isFocusModeActive?: boolean
  onToggleFocusMode?: () => void
}

export function Footer({
  onToggleAnnotations,
  isAnnotationsVisible = false,
  onToggleStickyNotes,
  isStickyNotesOpen = false,
  onBookmarkCurrentPage,
  onSearchInPage,
  onMarkText,
  onMakeNote,
  onOpenSettings,
  onHideToolbar,
  resourceType = 'content',
  currentPage = 1,
  totalPages = 1,
  pages = [],
  onNext,
  onPrevious,
  onPageSelect,
  onInteractiveStateChange,
  onMenusOpenChange,
  isFocusModeActive = false,
  onToggleFocusMode,
}: FooterProps) {
  const showTools = resourceType === 'content' || resourceType === 'material'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPageReelOpen, setIsPageReelOpen] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)

  // Monitor fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Notify parent about menu states
  const isAnyFooterFeatureOpen =
    isPageReelOpen ||
    isShareMenuOpen ||
    isSettingsMenuOpen ||
    isAnnotationsVisible ||
    isStickyNotesOpen

  useEffect(() => {
    onMenusOpenChange?.(isAnyFooterFeatureOpen)
  }, [isAnyFooterFeatureOpen, onMenusOpenChange])

  useEffect(() => {
    onInteractiveStateChange?.(
      isShareMenuOpen || (isPageReelOpen && isMenuHovered)
    )
  }, [isPageReelOpen, isShareMenuOpen, isMenuHovered, onInteractiveStateChange])

  // Handlers
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(
          `Error attempting to enable fullscreen mode: ${e.message} (${e.name})`
        )
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const togglePageReel = () => {
    if (!isPageReelOpen && isAnnotationsVisible && onToggleAnnotations) {
      onToggleAnnotations()
    }
    setIsPageReelOpen(!isPageReelOpen)
  }

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen)
  }

  const handleToggleAnnotations = () => {
    if (onToggleAnnotations) {
      if (!isAnnotationsVisible && isPageReelOpen) {
        setIsPageReelOpen(false)
      }
      onToggleAnnotations()
    }
  }

  const handleMarkText = () => {
    if (onMarkText) {
      onMarkText()
      return
    }
    handleToggleAnnotations()
  }

  const handleMakeNote = () => {
    if (onMakeNote) {
      onMakeNote()
      return
    }
    onToggleStickyNotes?.()
  }

  const handlePageSelect = (page: number) => {
    onPageSelect?.(page)
  }

  // Use provided pages or fallback to mock based on totalPages
  const displayPages =
    pages.length > 0
      ? pages
      : Array.from({ length: totalPages }, (_, i) => ({
          id: `page-${i + 1}`,
          content: null,
        }))

  return (
    <>
      <PageReel
        isOpen={isPageReelOpen}
        onClose={() => setIsPageReelOpen(false)}
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        pages={displayPages}
        currentPage={currentPage}
        onPageSelect={handlePageSelect}
      />
      <footer className="relative flex w-full items-center justify-center bg-[#2C2C2C] dark:bg-(--footer-header-bg) text-white max-md:h-20 max-md:px-4 md:h-[105px] md:px-8">
        <MobileFooterContent
          currentPage={currentPage}
          totalPages={totalPages}
          isPageReelOpen={isPageReelOpen}
          isFocusModeActive={isFocusModeActive}
          onTogglePageReel={togglePageReel}
          onToggleFocusMode={onToggleFocusMode}
          onSearchInPage={() => onSearchInPage?.()}
          onBookmarkPage={() => onBookmarkCurrentPage?.()}
          onMarkText={handleMarkText}
          onMakeNote={handleMakeNote}
          onOpenSettings={onOpenSettings}
          onHideToolbar={onHideToolbar}
          onSettingsMenuOpenChange={setIsSettingsMenuOpen}
        />

        <DesktopFooterContent
          currentPage={currentPage}
          totalPages={totalPages}
          showTools={showTools}
          isPageReelOpen={isPageReelOpen}
          isStickyNotesOpen={isStickyNotesOpen}
          isAnnotationsVisible={isAnnotationsVisible}
          isShareMenuOpen={isShareMenuOpen}
          isFullscreen={isFullscreen}
          onNext={onNext}
          onPrevious={onPrevious}
          onTogglePageReel={togglePageReel}
          onToggleStickyNotes={onToggleStickyNotes}
          onToggleAnnotations={handleToggleAnnotations}
          onToggleShareMenu={toggleShareMenu}
          onToggleFullscreen={toggleFullscreen}
        />

        <DesktopSettingsSection
          showTools={showTools}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onHideToolbar={onHideToolbar}
          onSettingsMenuOpenChange={setIsSettingsMenuOpen}
        />
      </footer>
    </>
  )
}

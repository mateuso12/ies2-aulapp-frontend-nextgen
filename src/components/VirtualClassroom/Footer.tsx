import React, { useState, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import {
  ArrowCircleRight,
  ArrowCircleLeft,
  ReceiveSquare,
  Edit2,
  Stickynote,
  Category,
} from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { PageReel, type PageData } from './PageReel'
import { SettingsMenu } from './SettingsMenu'

interface FooterProps {
  onToggleAnnotations?: () => void
  isAnnotationsVisible?: boolean
  onToggleStickyNotes?: () => void
  isStickyNotesOpen?: boolean
  onBookmarkCurrentPage?: () => void
  onSearchInPage?: () => void
  onMarkText?: () => void
  onMakeNote?: () => void
  onOpenSettings?: () => void
  resourceType?: string
  currentPage?: number
  totalPages?: number
  pages?: PageData[]
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
}

export const Footer: React.FC<FooterProps> = ({
  onToggleAnnotations,
  isAnnotationsVisible = false,
  onToggleStickyNotes,
  isStickyNotesOpen = false,
  onBookmarkCurrentPage,
  onSearchInPage,
  onMarkText,
  onMakeNote,
  onOpenSettings,
  resourceType = 'content',
  currentPage = 1,
  totalPages = 1,
  pages = [],
  onNext,
  onPrevious,
  onPageSelect,
}) => {
  const showTools = resourceType === 'content' || resourceType === 'material'
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPageReelOpen, setIsPageReelOpen] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  // Remove local state for annotations active, rely on prop or internal if not provided?
  // Actually, to support both controlled and uncontrolled, we can use a local state initialized with prop,
  // but here the parent controls the visibility (overlay).
  // So we should rely on isAnnotationsVisible.

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

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
    if (!isPageReelOpen) {
      // Closing other tools if opening reel
      if (isAnnotationsVisible && onToggleAnnotations) {
        onToggleAnnotations()
      }
    }
    setIsPageReelOpen(!isPageReelOpen)
  }

  const toggleShareMenu = () => {
    setIsShareMenuOpen(!isShareMenuOpen)
  }

  const handleSearchInPage = () => {
    if (onSearchInPage) {
      onSearchInPage()
      return
    }
    togglePageReel()
  }

  const handleBookmarkPage = () => {
    onBookmarkCurrentPage?.()
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

  const handleOpenSettings = () => {
    onOpenSettings?.()
  }

  const handleToggleAnnotations = () => {
    if (onToggleAnnotations) {
      if (!isAnnotationsVisible) {
        // Closing other tools if opening annotations
        if (isPageReelOpen) {
          setIsPageReelOpen(false)
        }
      }
      onToggleAnnotations()
    }
  }

  const handlePageSelect = (page: number) => {
    if (onPageSelect) {
      onPageSelect(page)
    }
    // Optional: Close reel on select? The user didn't specify.
    // setIsPageReelOpen(false)
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
        pages={displayPages}
        currentPage={currentPage}
        onPageSelect={handlePageSelect}
      />
      <footer className="relative flex w-full items-center justify-center bg-[#2C2C2C] text-white max-md:h-20 max-md:rounded-t-2xl max-md:px-4 md:h-[105px] md:px-8">
        {/* Mobile Content */}
        <div className="hidden w-full items-center justify-between max-md:flex">
          {/* Left: Page reel */}
          <Button
            onClick={togglePageReel}
            variant="ghost"
            size="icon"
            className={`rounded-lg transition-colors hover:bg-black hover:text-white ${
              isPageReelOpen ? 'bg-primary text-white hover:bg-primary' : ''
            }`}
            aria-label="Abrir menu de páginas"
          >
            <Category size="24" color="currentColor" variant="Linear" />
          </Button>

          {/* Center: Counter */}
          <span className="font-plus-jakarta text-xl font-semibold">
            {currentPage} de {totalPages}
          </span>

          {/* Right: Settings */}
          <div className="flex items-center gap-3">
            <SettingsMenu
              isMobile
              onSearchInPage={handleSearchInPage}
              onBookmarkPage={handleBookmarkPage}
              onMarkText={handleMarkText}
              onMakeNote={handleMakeNote}
              onOpenSettings={handleOpenSettings}
            />
          </div>
        </div>

        {/* Desktop Content */}
        <div className="hidden w-full max-w-[1092px] items-center justify-between md:flex">
          {/* Left Arrow */}
          <Button
            onClick={onPrevious}
            disabled={currentPage <= 1}
            variant="ghost"
            size="icon"
            className={`h-[54px] w-[54px] rounded-full text-white hover:bg-white/10 ${
              currentPage <= 1 ? 'opacity-50' : ''
            }`}
          >
            <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
          </Button>

          {/* Center Tools */}
          <div className="flex items-center gap-12">
            {/* Tools Group */}
            <div className="flex items-center gap-8">
              <Button
                onClick={togglePageReel}
                variant="ghost"
                size="icon"
                className={`rounded-lg transition-colors hover:bg-black text-white ${
                  isPageReelOpen
                    ? 'bg-[#FF246E] text-white hover:bg-primary'
                    : ''
                }`}
                aria-label="Menu"
              >
                <Category size="24" color="currentColor" variant="Linear" />
              </Button>
              {showTools && (
                <>
                  <Button
                    onClick={onToggleStickyNotes}
                    variant="ghost"
                    size="icon"
                    className={`rounded-lg transition-colors hover:bg-black text-white ${
                      isStickyNotesOpen
                        ? 'bg-[#FF246E] text-white hover:bg-primary'
                        : ''
                    }`}
                  >
                    <Stickynote
                      size="24"
                      color="currentColor"
                      variant="Linear"
                    />
                  </Button>
                  {onToggleAnnotations && (
                    <Button
                      onClick={handleToggleAnnotations}
                      variant="ghost"
                      size="icon"
                      className={`rounded-lg transition-colors hover:bg-black text-white ${
                        isAnnotationsVisible
                          ? 'bg-[#FF246E] text-white hover:bg-primary'
                          : ''
                      }`}
                    >
                      <Edit2 size="24" color="currentColor" variant="Linear" />
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Slide Counter */}
            <span className="font-plus-jakarta text-2xl">
              <span className="font-bold">{currentPage}</span> de{' '}
              <span className="font-bold">{totalPages}</span>
            </span>

            {/* Right Tools */}
            <div className="flex items-center gap-8">
              <Button
                onClick={toggleShareMenu}
                variant="ghost"
                size="icon"
                className={`rounded-lg transition-colors hover:bg-black text-white ${
                  isShareMenuOpen
                    ? 'bg-[#FF246E] text-white hover:bg-primary'
                    : ''
                }`}
              >
                <ReceiveSquare
                  size="24"
                  color="currentColor"
                  variant="Linear"
                />
              </Button>
              {showTools && (
                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="icon"
                  className="rounded-lg transition-colors hover:bg-black text-white"
                >
                  {isFullscreen ? (
                    <Minimize2 size={20} />
                  ) : (
                    <Maximize2 size={20} />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <Button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            variant="ghost"
            size="icon"
            className={`h-[54px] w-[54px] rounded-full text-white hover:bg-white/10 ${
              currentPage >= totalPages ? 'opacity-50' : ''
            }`}
          >
            <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
          </Button>
        </div>

        {/* Settings (Desktop Only) */}
        <div className="absolute right-8 hidden items-center gap-2 md:flex">
          {!showTools && (
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="rounded-lg transition-colors hover:bg-black hover:text-white"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </Button>
          )}
          <SettingsMenu />
        </div>
      </footer>
    </>
  )
}

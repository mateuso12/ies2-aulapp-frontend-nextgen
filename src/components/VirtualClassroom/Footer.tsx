import React, { useState, useEffect } from 'react'
import {
  Setting2,
  ArrowCircleRight,
  ArrowCircleLeft,
  Maximize3,
  Minus,
  ReceiveSquare,
  Edit2,
  Stickynote,
  Category,
  RefreshLeftSquare,
} from 'iconsax-react'
import { PageReel, type PageData } from './PageReel'

interface FooterProps {
  onToggleAnnotations?: () => void
  isAnnotationsVisible?: boolean
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
          {/* Left Tools */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePageReel}
              className={`p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors ${
                isPageReelOpen ? 'bg-black text-white' : ''
              }`}
            >
              <Category size="24" color="currentColor" variant="Linear" />
            </button>
            <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
              <RefreshLeftSquare
                size="24"
                color="currentColor"
                variant="Linear"
              />
            </button>
          </div>

          {/* Center: Counter & Dots */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-plus-jakarta text-xl">
              <span className="font-bold">{currentPage}</span> de{' '}
              <span className="font-bold">{totalPages}</span>
            </span>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-4">
            <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
              <ReceiveSquare size="24" color="currentColor" variant="Linear" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors"
            >
              {isFullscreen ? (
                <Minus size="24" color="currentColor" variant="Linear" />
              ) : (
                <Maximize3 size="24" color="currentColor" variant="Linear" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="hidden w-full max-w-[1092px] items-center justify-between md:flex">
          {/* Left Arrow */}
          <button
            onClick={onPrevious}
            disabled={currentPage <= 1}
            className={`flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10 cursor-pointer ${
              currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
          </button>

          {/* Center Tools */}
          <div className="flex items-center gap-12">
            {/* Tools Group */}
            <div className="flex items-center gap-8">
              <button
                onClick={togglePageReel}
                className={`p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors ${
                  isPageReelOpen ? 'bg-black text-white' : ''
                }`}
                aria-label="Menu"
              >
                <Category size="24" color="currentColor" variant="Linear" />
              </button>
              {showTools && (
                <>
                  <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
                    <Stickynote
                      size="24"
                      color="currentColor"
                      variant="Linear"
                    />
                  </button>
                  {onToggleAnnotations && (
                    <button
                      onClick={handleToggleAnnotations}
                      className={`p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors ${
                        isAnnotationsVisible ? 'bg-black text-white' : ''
                      }`}
                    >
                      <Edit2 size="24" color="currentColor" variant="Linear" />
                    </button>
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
              <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
                <ReceiveSquare
                  size="24"
                  color="currentColor"
                  variant="Linear"
                />
              </button>
              {showTools && (
                <button
                  onClick={toggleFullscreen}
                  className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors"
                >
                  {isFullscreen ? (
                    <Minus size="24" color="currentColor" variant="Linear" />
                  ) : (
                    <Maximize3
                      size="24"
                      color="currentColor"
                      variant="Linear"
                    />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={onNext}
            disabled={currentPage >= totalPages}
            className={`flex h-[54px] w-[54px] items-center justify-center rounded-full hover:bg-white/10 cursor-pointer ${
              currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
          </button>
        </div>

        {/* Settings (Desktop Only) */}
        <div className="absolute right-8 hidden items-center gap-2 md:flex">
          {!showTools && (
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors"
            >
              {isFullscreen ? (
                <Minus size="24" color="currentColor" variant="Linear" />
              ) : (
                <Maximize3 size="24" color="currentColor" variant="Linear" />
              )}
            </button>
          )}
          <button className="p-3 rounded-lg hover:bg-black hover:text-white cursor-pointer transition-colors">
            <Setting2 size="24" color="currentColor" variant="Linear" />
          </button>
        </div>
      </footer>
    </>
  )
}

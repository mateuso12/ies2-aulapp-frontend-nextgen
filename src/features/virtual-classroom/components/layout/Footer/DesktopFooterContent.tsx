import { ArrowCircleRight, ArrowCircleLeft } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { DesktopFooterTools } from './DesktopFooterTools'

interface DesktopFooterContentProps {
  currentPage: number
  totalPages: number
  showTools: boolean
  isPageReelOpen: boolean
  isStickyNotesOpen: boolean
  isAnnotationsVisible: boolean
  isShareMenuOpen: boolean
  isFullscreen: boolean
  onNext?: () => void
  onPrevious?: () => void
  onTogglePageReel: () => void
  onToggleStickyNotes?: () => void
  onToggleAnnotations?: () => void
  onToggleShareMenu: () => void
  onToggleFullscreen: () => void
}

export function DesktopFooterContent({
  currentPage,
  totalPages,
  showTools,
  isPageReelOpen,
  isStickyNotesOpen,
  isAnnotationsVisible,
  isShareMenuOpen,
  isFullscreen,
  onNext,
  onPrevious,
  onTogglePageReel,
  onToggleStickyNotes,
  onToggleAnnotations,
  onToggleShareMenu,
  onToggleFullscreen,
}: DesktopFooterContentProps) {
  return (
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
        aria-label="Página anterior"
        title="Página anterior"
      >
        <ArrowCircleLeft size="45" color="currentColor" variant="Bold" />
      </Button>

      {/* Center Tools */}
      <DesktopFooterTools
        currentPage={currentPage}
        totalPages={totalPages}
        showTools={showTools}
        isPageReelOpen={isPageReelOpen}
        isStickyNotesOpen={isStickyNotesOpen}
        isAnnotationsVisible={isAnnotationsVisible}
        isShareMenuOpen={isShareMenuOpen}
        isFullscreen={isFullscreen}
        onTogglePageReel={onTogglePageReel}
        onToggleStickyNotes={onToggleStickyNotes}
        onToggleAnnotations={onToggleAnnotations}
        onToggleShareMenu={onToggleShareMenu}
        onToggleFullscreen={onToggleFullscreen}
      />

      {/* Right Arrow */}
      <Button
        onClick={onNext}
        disabled={currentPage >= totalPages}
        variant="ghost"
        size="icon"
        className={`h-[54px] w-[54px] rounded-full text-white hover:bg-white/10 ${
          currentPage >= totalPages ? 'opacity-50' : ''
        }`}
        aria-label="Próxima página"
        title="Próxima página"
      >
        <ArrowCircleRight size="45" color="currentColor" variant="Bold" />
      </Button>
    </div>
  )
}

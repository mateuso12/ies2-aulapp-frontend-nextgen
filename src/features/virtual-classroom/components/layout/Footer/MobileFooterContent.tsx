import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Category } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { useTranslation } from 'react-i18next'
import { SettingsMenu } from '../../overlays/SettingsMenu'

interface MobileFooterContentProps {
  currentPage: number
  totalPages: number
  isPageReelOpen: boolean
  isFocusModeActive: boolean
  showTools: boolean
  onTogglePageReel: () => void
  onToggleFocusMode?: () => void
  onSearchInPage: () => void
  onBookmarkPage: () => void
  onMarkText: () => void
  onMakeNote: () => void
  onOpenSettings?: () => void
  onHideToolbar?: () => void
  onSettingsMenuOpenChange: (isOpen: boolean) => void
  onNext?: () => void
  onPrevious?: () => void
}

export function MobileFooterContent({
  currentPage,
  totalPages,
  isPageReelOpen,
  isFocusModeActive,
  showTools,
  onTogglePageReel,
  onToggleFocusMode,
  onSearchInPage,
  onBookmarkPage,
  onMarkText,
  onMakeNote,
  onOpenSettings,
  onHideToolbar,
  onSettingsMenuOpenChange,
  onNext,
  onPrevious,
}: MobileFooterContentProps) {
  const { t } = useTranslation('footer')
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="hidden w-full max-md:grid max-md:grid-cols-3 max-md:items-center">
      {/* Left: Page reel */}
      <div className="flex justify-start">
        <Button
          onClick={onTogglePageReel}
          variant="ghost"
          size="icon"
          className={`rounded-lg transition-colors hover:bg-black text-white ${
            isPageReelOpen ? 'bg-[#FF246E] text-white' : ''
          }`}
          aria-label={t('viewAllPages')}
          title={t('viewAllPages')}
        >
          <Category size="24" color="currentColor" variant="Linear" />
        </Button>
      </div>

      {/* Center: Navigation and Counter */}
      <div className="flex items-center justify-center gap-1">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md transition-colors hover:bg-black/50 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Página anterior"
          title="Página anterior"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </Button>

        <span className="font-plus-jakarta text-xl font-semibold text-center min-w-[80px]">
          {currentPage} de {totalPages}
        </span>

        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md transition-colors hover:bg-black/50 text-white disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Próxima página"
          title="Próxima página"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </Button>
      </div>

      {/* Right: Settings and Fullscreen (Mobile only) */}
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={onToggleFocusMode}
          variant="ghost"
          size="icon"
          className="rounded-lg transition-colors hover:bg-black text-white"
          aria-label={isFocusModeActive ? t('exitFullscreen') : t('fullscreen')}
          title={isFocusModeActive ? t('exitFullscreen') : t('fullscreen')}
        >
          {isFocusModeActive ? (
            <Minimize2 size={24} />
          ) : (
            <Maximize2 size={24} />
          )}
        </Button>
        <SettingsMenu
          isMobile
          showTools={showTools}
          onSearchInPage={onSearchInPage}
          onBookmarkPage={onBookmarkPage}
          onMarkText={onMarkText}
          onMakeNote={onMakeNote}
          onOpenSettings={onOpenSettings}
          onHideToolbar={onHideToolbar}
          onOpenChange={onSettingsMenuOpenChange}
        />
      </div>
    </div>
  )
}

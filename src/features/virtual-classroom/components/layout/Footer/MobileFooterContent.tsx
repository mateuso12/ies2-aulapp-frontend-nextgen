import { Maximize2, Minimize2 } from 'lucide-react'
import { Category } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { SettingsMenu } from '../../overlays/SettingsMenu'

interface MobileFooterContentProps {
  currentPage: number
  totalPages: number
  isPageReelOpen: boolean
  isFocusModeActive: boolean
  onTogglePageReel: () => void
  onToggleFocusMode?: () => void
  onSearchInPage: () => void
  onBookmarkPage: () => void
  onMarkText: () => void
  onMakeNote: () => void
  onOpenSettings?: () => void
  onHideToolbar?: () => void
  onSettingsMenuOpenChange: (isOpen: boolean) => void
}

export function MobileFooterContent({
  currentPage,
  totalPages,
  isPageReelOpen,
  isFocusModeActive,
  onTogglePageReel,
  onToggleFocusMode,
  onSearchInPage,
  onBookmarkPage,
  onMarkText,
  onMakeNote,
  onOpenSettings,
  onHideToolbar,
  onSettingsMenuOpenChange,
}: MobileFooterContentProps) {
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
          aria-label="Ver todas as páginas"
          title="Ver todas as páginas"
        >
          <Category size="24" color="currentColor" variant="Linear" />
        </Button>
      </div>

      {/* Center: Counter */}
      <span className="font-plus-jakarta text-xl font-semibold text-center">
        {currentPage} de {totalPages}
      </span>

      {/* Right: Settings and Fullscreen (Mobile only) */}
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={onToggleFocusMode}
          variant="ghost"
          size="icon"
          className="rounded-lg transition-colors hover:bg-black text-white"
          aria-label={isFocusModeActive ? 'Sair da tela cheia' : 'Tela cheia'}
          title={isFocusModeActive ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFocusModeActive ? (
            <Minimize2 size={24} />
          ) : (
            <Maximize2 size={24} />
          )}
        </Button>
        <SettingsMenu
          isMobile
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

import { Maximize2, Minimize2 } from 'lucide-react'
import { ReceiveSquare, Edit2, Stickynote, Category } from 'iconsax-react'
import { Button } from 'ies2-aulapp-ui-kit'
import { useTranslation } from 'react-i18next'

interface DesktopFooterToolsProps {
  currentPage: number
  totalPages: number
  showTools: boolean
  isPageReelOpen: boolean
  isStickyNotesOpen: boolean
  isAnnotationsVisible: boolean
  isShareMenuOpen: boolean
  isFullscreen: boolean
  onTogglePageReel: () => void
  onToggleStickyNotes?: () => void
  onToggleAnnotations?: () => void
  onToggleShareMenu: () => void
  onToggleFullscreen: () => void
}

export function DesktopFooterTools({
  currentPage,
  totalPages,
  showTools,
  isPageReelOpen,
  isStickyNotesOpen,
  isAnnotationsVisible,
  isShareMenuOpen,
  isFullscreen,
  onTogglePageReel,
  onToggleStickyNotes,
  onToggleAnnotations,
  onToggleShareMenu,
  onToggleFullscreen,
}: DesktopFooterToolsProps) {
  const { t } = useTranslation('footer')

  return (
    <div className="flex items-center gap-12">
      {/* Tools Group */}
      <div className="flex items-center gap-8">
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
        {showTools && (
          <>
            <Button
              onClick={onToggleStickyNotes}
              variant="ghost"
              size="icon"
              className={`rounded-lg transition-colors hover:bg-black text-white ${
                isStickyNotesOpen ? 'bg-[#FF246E] text-white' : ''
              }`}
              aria-label={t('annotations')}
              title={t('annotations')}
            >
              <Stickynote size="24" color="currentColor" variant="Linear" />
            </Button>
            {onToggleAnnotations && (
              <Button
                onClick={onToggleAnnotations}
                variant="ghost"
                size="icon"
                className={`rounded-lg transition-colors hover:bg-black text-white ${
                  isAnnotationsVisible
                    ? 'bg-[#FF246E] text-white  hover:bg-[#FF246E]'
                    : ''
                }`}
                aria-label={t('highlights')}
                title={t('highlights')}
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
          onClick={onToggleShareMenu}
          variant="ghost"
          size="icon"
          className={`rounded-lg transition-colors hover:bg-black text-white ${
            isShareMenuOpen ? 'bg-[#FF246E] text-white hover:bg-[#FF246E]' : ''
          }`}
          aria-label={t('downloads')}
          title={t('downloads')}
        >
          <ReceiveSquare size="24" color="currentColor" variant="Linear" />
        </Button>
        {showTools && (
          <Button
            onClick={onToggleFullscreen}
            variant="ghost"
            size="icon"
            className="rounded-lg transition-colors hover:bg-black text-white"
            aria-label={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
            title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
          >
            {isFullscreen ? (
              <Minimize2 size={20} color="currentColor" />
            ) : (
              <Maximize2 size={20} color="currentColor" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

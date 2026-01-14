import { Minimize2 } from 'lucide-react'
import { FloatingBookmarkButton } from '@/features/virtual-classroom/components/overlays/FloatingBookmarkButton'

interface FloatingButtonsProps {
  isContent: boolean
  isCurrentPageBookmarked: boolean
  isFocusModeActive: boolean
  isMobile: boolean
  onBookmarkClick: () => void
  onToggleFocusMode: () => void
}

export function FloatingButtons({
  isContent,
  isCurrentPageBookmarked,
  isFocusModeActive,
  isMobile,
  onBookmarkClick,
  onToggleFocusMode,
}: FloatingButtonsProps) {
  return (
    <>
      <FloatingBookmarkButton
        isBookmarked={isCurrentPageBookmarked}
        onClick={onBookmarkClick}
        isVisible={isContent}
      />

      {/* Botão flutuante para sair do modo foco (mobile) */}
      {isFocusModeActive && isMobile && (
        <button
          onClick={onToggleFocusMode}
          className="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95"
          aria-label="Sair da tela cheia"
          title="Sair da tela cheia"
        >
          <Minimize2 size={18} />
        </button>
      )}
    </>
  )
}

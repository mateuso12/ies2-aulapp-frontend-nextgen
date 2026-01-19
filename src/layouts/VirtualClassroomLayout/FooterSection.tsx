import { Footer } from '@/features/virtual-classroom/components/layout/Footer/index'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'
import type { ResourceType } from './types'

interface FooterSectionProps {
  resourceType: ResourceType | string
  currentPage: number
  totalPages: number
  enhancedPages: PageData[]
  isFooterHidden: boolean
  isBarsAutoHidden: boolean
  isVisible: boolean
  isStickyNoteSidebarOpen: boolean
  isFocusModeActive: boolean
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
  onFooterHovered: (hovered: boolean) => void
  onToggleAnnotations: () => void
  onToggleStickyNotes: () => void
  onBookmarkClick: () => void
  onSearchInPage: () => void
  onToggleBarsAutoHidden: () => void
  onFooterInteracting: (interacting: boolean) => void
  onFooterMenusOpen: (isOpen: boolean) => void
  onToggleFocusMode: () => void
}

export function FooterSection({
  resourceType,
  currentPage,
  totalPages,
  enhancedPages,
  isFooterHidden,
  isBarsAutoHidden,
  isVisible,
  isStickyNoteSidebarOpen,
  isFocusModeActive,
  onNext,
  onPrevious,
  onPageSelect,
  onFooterHovered,
  onToggleAnnotations,
  onToggleStickyNotes,
  onBookmarkClick,
  onSearchInPage,
  onToggleBarsAutoHidden,
  onFooterInteracting,
  onFooterMenusOpen,
  onToggleFocusMode,
}: FooterSectionProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 z-70 w-full transform-gpu transition-transform duration-300 ease-out ${
        isFooterHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
      onMouseEnter={() => isBarsAutoHidden && onFooterHovered(true)}
      onMouseLeave={() => isBarsAutoHidden && onFooterHovered(false)}
    >
      <Footer
        onToggleAnnotations={onToggleAnnotations}
        isAnnotationsVisible={isVisible}
        resourceType={resourceType}
        currentPage={currentPage}
        totalPages={totalPages}
        pages={enhancedPages}
        onNext={onNext}
        onPrevious={onPrevious}
        onPageSelect={onPageSelect}
        onToggleStickyNotes={onToggleStickyNotes}
        isStickyNotesOpen={isStickyNoteSidebarOpen}
        onBookmarkCurrentPage={onBookmarkClick}
        onSearchInPage={onSearchInPage}
        onMarkText={onToggleAnnotations}
        onMakeNote={onToggleStickyNotes}
        onHideToolbar={onToggleBarsAutoHidden}
        onInteractiveStateChange={onFooterInteracting}
        onMenusOpenChange={onFooterMenusOpen}
        isFocusModeActive={isFocusModeActive}
        onToggleFocusMode={onToggleFocusMode}
      />
    </div>
  )
}

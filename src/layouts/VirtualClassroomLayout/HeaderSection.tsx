import { Header } from '@/features/virtual-classroom/components/layout/Header'
import type { ResourceType } from './types'

interface HeaderSectionProps {
  variant: 'default' | 'gamified'
  currentPage: number
  totalPages: number
  resourceType: ResourceType | string
  isHeaderHidden: boolean
  isBarsAutoHidden: boolean
  isCurrentPageBookmarked: boolean
  currentNotesCount: number
  strokesCount: number
  hasCurrentPageHighlights: boolean
  onHeaderHovered: (hovered: boolean) => void
  onBookmarkClick: () => void
  onMenusOpenChange: (isOpen: boolean) => void
  onToggleStickyNotes: () => void
  onToggleAnnotations: () => void
}

export function HeaderSection({
  variant,
  currentPage,
  totalPages,
  resourceType,
  isHeaderHidden,
  isBarsAutoHidden,
  isCurrentPageBookmarked,
  currentNotesCount,
  strokesCount,
  hasCurrentPageHighlights,
  onHeaderHovered,
  onBookmarkClick,
  onMenusOpenChange,
  onToggleStickyNotes,
  onToggleAnnotations,
}: HeaderSectionProps) {
  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full transform-gpu transition-transform duration-300 ease-out ${
        isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      onMouseEnter={() => isBarsAutoHidden && onHeaderHovered(true)}
      onMouseLeave={() => isBarsAutoHidden && onHeaderHovered(false)}
    >
      <Header
        variant={variant}
        title="Nome do conteúdo"
        currentPage={currentPage}
        totalPages={totalPages}
        resourceType={resourceType}
        onBookmark={onBookmarkClick}
        isBookmarked={isCurrentPageBookmarked}
        onMenusOpenChange={onMenusOpenChange}
        hasCurrentPageNotes={currentNotesCount > 0}
        hasCurrentPageAnnotations={strokesCount > 0 || hasCurrentPageHighlights}
        onToggleStickyNotes={onToggleStickyNotes}
        onToggleAnnotations={onToggleAnnotations}
      />
    </div>
  )
}

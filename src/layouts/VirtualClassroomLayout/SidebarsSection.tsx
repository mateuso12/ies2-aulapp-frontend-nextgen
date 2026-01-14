import { BookmarksSidebar } from '@/features/virtual-classroom/components/overlays/BookmarksSidebar'
import { StickyNoteSidebar } from '@/features/sticky-notes'
import type { StickyNote } from '@/features/sticky-notes/types'

interface SidebarsSectionProps {
  isBookmarksSidebarOpen: boolean
  isStickyNoteSidebarOpen: boolean
  bookmarks: number[]
  stickyNotes: StickyNote[]
  currentPage: number
  areStickyNotesVisible: boolean
  onCloseBookmarks: () => void
  onCloseStickyNotes: () => void
  onRemoveBookmark: (page: number) => void
  onNavigateToPage: (page: number) => void
  onAddNote: (note?: Partial<StickyNote>) => void
  onEditNote: (note: StickyNote) => void
  onDeleteNote: (id: string) => void
  onGoToNote: (note: StickyNote) => void
  onToggleNotesVisibility: () => void
}

export function SidebarsSection({
  isBookmarksSidebarOpen,
  isStickyNoteSidebarOpen,
  bookmarks,
  stickyNotes,
  currentPage,
  areStickyNotesVisible,
  onCloseBookmarks,
  onCloseStickyNotes,
  onRemoveBookmark,
  onNavigateToPage,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onGoToNote,
  onToggleNotesVisibility,
}: SidebarsSectionProps) {
  return (
    <>
      <BookmarksSidebar
        isOpen={isBookmarksSidebarOpen}
        onClose={onCloseBookmarks}
        bookmarks={bookmarks}
        currentPage={currentPage}
        onRemoveBookmark={onRemoveBookmark}
        onNavigate={onNavigateToPage}
      />

      <StickyNoteSidebar
        isOpen={isStickyNoteSidebarOpen}
        onClose={onCloseStickyNotes}
        notes={stickyNotes}
        onAddNote={onAddNote}
        onEditNote={onEditNote}
        onDeleteNote={onDeleteNote}
        onGoToNote={onGoToNote}
        onToggleVisibility={onToggleNotesVisibility}
        areNotesVisible={areStickyNotesVisible}
      />
    </>
  )
}

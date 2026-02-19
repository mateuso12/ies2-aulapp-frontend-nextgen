import React from 'react'
import { ArchiveTick, CloseCircle, Trash, ArrowRight2 } from 'iconsax-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { useTranslation } from 'react-i18next'

interface BookmarksSidebarProps {
  isOpen: boolean
  onClose: () => void
  bookmarks: number[]
  currentPage?: number
  onRemoveBookmark: (page: number) => void
  onNavigate: (page: number) => void
}

export const BookmarksSidebar: React.FC<BookmarksSidebarProps> = ({
  isOpen,
  onClose,
  bookmarks,
  currentPage,
  onRemoveBookmark,
  onNavigate,
}) => {
  const { t } = useTranslation('menu')
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const SidebarContent = () => (
    <div className="flex h-full flex-col p-4 gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArchiveTick
            size="24"
            color="#343A40"
            className="dark:text-foreground"
            variant="Linear"
          />
          <h2 className="text-lg font-bold text-[#343A40] dark:text-foreground">
            {t('bookmarks')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-[#343A40] dark:text-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
        >
          <CloseCircle size="24" color="currentColor" variant="Linear" />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
        {bookmarks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            {t('noBookmarks')}
          </div>
        ) : (
          bookmarks.map((page) => {
            const isActive = currentPage === page
            return (
              <div
                key={page}
                onClick={() => {
                  if (!isActive) {
                    onNavigate(page)
                    onClose()
                  }
                }}
                className={`group flex w-full flex-col gap-4 rounded-lg bg-white dark:bg-(--paper-bg) p-4 transition-all border text-left ${
                  isActive
                    ? 'border-[#487BFF] dark:border-[#5A8FFF] cursor-default'
                    : 'border-transparent hover:border-black dark:hover:border-white cursor-pointer'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-bold text-[#343A40] dark:text-foreground">
                    {t('page')} {page}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveBookmark(page)
                    }}
                    className="text-[#343A40] dark:text-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash size="24" color="currentColor" variant="Linear" />
                  </button>
                </div>

                <div
                  className={`flex w-full items-center justify-end gap-2 text-[#6C757D] dark:text-gray-400 group-hover:text-[#487BFF] dark:group-hover:text-[#5A8FFF] transition-colors ${
                    isActive ? 'invisible' : ''
                  }`}
                >
                  <span className="text-sm font-normal leading-[18px]">
                    {t('goToBookmark')}
                  </span>
                  <ArrowRight2
                    size="16"
                    color="currentColor"
                    variant="Linear"
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  if (isDesktop) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="left"
          className="w-[347px] bg-[#EFEFEF] dark:bg-card p-0 border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.1)]"
        >
          <SheetTitle className="sr-only">Marca páginas</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#EFEFEF] dark:bg-card h-[80vh] outline-none z-90">
        <SidebarContent />
      </DrawerContent>
    </Drawer>
  )
}

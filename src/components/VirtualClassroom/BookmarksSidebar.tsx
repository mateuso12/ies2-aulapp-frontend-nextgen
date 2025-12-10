import React from 'react'
import { ArchiveTick, CloseCircle, Trash, ArrowRight2 } from 'iconsax-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-50 h-full w-[347px] bg-[#EFEFEF] shadow-[4px_0_24px_rgba(0,0,0,0.1)]"
          >
            <div className="flex h-full flex-col p-4 gap-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArchiveTick size="24" color="#343A40" variant="Linear" />
                  <h2 className="text-lg font-bold text-[#343A40]">
                    Marca páginas
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#343A40] hover:text-red-500 transition-colors cursor-pointer"
                >
                  <CloseCircle
                    size="24"
                    color="currentColor"
                    variant="Linear"
                  />
                </button>
              </div>

              {/* List */}
              <div className="flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
                {bookmarks.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhuma página marcada.
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
                        className={`group flex w-full flex-col gap-4 rounded-lg bg-white p-4 transition-all border text-left ${
                          isActive
                            ? 'border-[#487BFF] cursor-default'
                            : 'border-transparent hover:border-black cursor-pointer'
                        }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="font-bold text-[#343A40]">
                            Página {page}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRemoveBookmark(page)
                            }}
                            className="text-[#343A40] hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash
                              size="24"
                              color="currentColor"
                              variant="Linear"
                            />
                          </button>
                        </div>

                        <div
                          className={`flex w-full items-center justify-end gap-2 text-[#6C757D] group-hover:text-[#487BFF] transition-colors ${
                            isActive ? 'invisible' : ''
                          }`}
                        >
                          <span className="text-sm font-normal leading-[18px]">
                            Ir para Marcador
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

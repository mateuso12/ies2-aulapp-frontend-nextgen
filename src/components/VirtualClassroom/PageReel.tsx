import React, { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { TickCircle, Edit2, Stickynote, ArchiveAdd, Lock } from 'iconsax-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface PageData {
  id: string | number
  content: React.ReactNode
  isLocked?: boolean
  isCompleted?: boolean
  hasDrawings?: boolean
  hasAnnotations?: boolean
  isBookmarked?: boolean
}

interface PageReelProps {
  isOpen: boolean
  onClose: () => void
  pages: PageData[]
  currentPage: number
  onPageSelect: (pageIndex: number) => void
}

export const PageReel: React.FC<PageReelProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage,
  onPageSelect,
}) => {
  const [isMaximized, setIsMaximized] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop to close on click outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`absolute bottom-[120px] left-1/2 -translate-x-1/2 bg-[#2C2C2C] rounded-2xl shadow-xl z-50 transition-all duration-300 ease-in-out ${
            isMaximized
              ? 'w-[90vw] h-[80vh] max-w-[1644px] max-h-[619px]'
              : 'w-[90vw] h-[258px] max-w-[1644px]'
          }`}
        >
          <div className="relative w-full h-full p-8 flex flex-col">
            {/* Header / Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-3 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                title={isMaximized ? 'Minimizar' : 'Maximizar'}
              >
                {isMaximized ? (
                  <Minimize2 size={24} />
                ) : (
                  <Maximize2 size={24} />
                )}
              </button>
            </div>

            {/* Content */}
            <div
              className={`w-full h-full custom-scrollbar ${
                isMaximized
                  ? 'overflow-y-auto overflow-x-hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                  : 'overflow-x-auto overflow-y-hidden flex gap-4 items-center px-4'
              }`}
            >
              {pages.map((page, index) => {
                const pageNumber = index + 1
                const isActive = currentPage === pageNumber
                const isLocked = page.isLocked
                const isCompleted = page.isCompleted && !isActive

                // Styles based on state
                let borderClass = 'border-transparent'
                let shadowClass = ''
                let overlayClass = 'bg-transparent'
                let numberColorClass = 'text-white'

                if (isActive) {
                  borderClass = 'border-[#487BFF] border-4'
                  shadowClass = 'shadow-[0_0_24px_rgba(72,123,255,1)]'
                  overlayClass = 'bg-transparent'
                  numberColorClass = 'text-white'
                } else if (isCompleted) {
                  borderClass = 'border-[#46B35E] border-2'
                  overlayClass = 'bg-[#46B35E]/25'
                  numberColorClass = 'text-white'
                } else if (isLocked) {
                  overlayClass = 'bg-white/40'
                  numberColorClass = 'text-white/50'
                }

                return (
                  <button
                    key={index}
                    onClick={() => !isLocked && onPageSelect(pageNumber)}
                    disabled={isLocked}
                    className={`relative shrink-0 group flex flex-col items-center gap-2 transition-all ${
                      isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                    } ${isMaximized ? 'w-full' : 'w-[198px]'}`}
                  >
                    {/* Thumbnail Container */}
                    <div
                      className={`relative w-full aspect-4/3 rounded-lg overflow-hidden bg-white transition-all ${borderClass} ${shadowClass}`}
                    >
                      {/* Page Preview */}
                      <div className="absolute inset-0 overflow-hidden bg-white">
                        <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] p-8 pointer-events-none select-none text-left text-black">
                          {page.content}
                        </div>
                      </div>

                      {/* State Overlay */}
                      <div
                        className={`absolute inset-0 ${overlayClass} transition-colors flex items-center justify-center text-muted-foreground`}
                      >
                        {isLocked && (
                          <Lock size={32} variant="Bold" color="currentColor" />
                        )}
                      </div>

                      {/* Feature Icons (Top Left) */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {page.hasAnnotations && (
                          <div className="w-8 h-8 bg-[#8A5CCC] rounded-lg flex items-center justify-center shadow-sm text-white">
                            <Stickynote
                              size={24}
                              variant="Outline"
                              color="currentColor"
                            />
                          </div>
                        )}
                        {page.hasDrawings && (
                          <div className="w-8 h-8 bg-[#F3C353] rounded-lg flex items-center justify-center shadow-sm text-black">
                            <Edit2
                              size={24}
                              variant="Outline"
                              color="currentColor"
                            />
                          </div>
                        )}
                        {page.isBookmarked && (
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#487BFF]">
                            <ArchiveAdd
                              size={24}
                              variant="Bold"
                              color="currentColor"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer: Page Number & Status */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                      {isCompleted && (
                        <TickCircle size={20} variant="Bold" color="#46B35E" />
                      )}
                      <span className={`font-bold text-lg ${numberColorClass}`}>
                        {pageNumber}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  TickCircle,
  Edit2,
  Stickynote,
  ArchiveAdd,
  Lock,
  LampOn,
} from 'iconsax-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from '@/hooks/use-media-query'

export interface PageData {
  id: string | number
  content: React.ReactNode
  isLocked?: boolean
  isCompleted?: boolean
  hasDrawings?: boolean
  hasAnnotations?: boolean
  isBookmarked?: boolean
  hasHighlights?: boolean
}

interface PageReelProps {
  isOpen: boolean
  onClose: () => void
  pages: PageData[]
  currentPage: number
  onPageSelect: (pageIndex: number) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const PageReel: React.FC<PageReelProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage,
  onPageSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Block body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop to close on click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{
              y: isMobile ? '100%' : 20,
              opacity: isMobile ? 1 : 0,
              x: isMobile ? 0 : '-50%',
            }}
            animate={{ y: 0, opacity: 1, x: isMobile ? 0 : '-50%' }}
            exit={{
              y: isMobile ? '100%' : 20,
              opacity: isMobile ? 1 : 0,
              x: isMobile ? 0 : '-50%',
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`fixed z-40 bg-[#2C2C2C] shadow-xl ${
              isMobile
                ? 'inset-x-0 bottom-0 rounded-t-3xl h-[85vh]'
                : 'bottom-[120px] left-1/2 rounded-2xl w-[90vw] h-[80vh] max-w-[1644px] max-h-[619px]'
            }`}
          >
            <div className="relative w-full h-full flex flex-col overflow-hidden">
              {/* Content - Always in grid mode */}
              <div
                className={`w-full flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${
                  isMobile ? 'px-4 pt-4 pb-12' : 'p-8'
                }`}
              >
                <div
                  className="grid gap-4 pb-12"
                  style={{
                    gridTemplateColumns: isMobile
                      ? 'repeat(auto-fill, minmax(140px, 1fr))'
                      : 'repeat(auto-fill, minmax(180px, 1fr))',
                  }}
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
                      shadowClass = 'shadow-[0_0_16px_rgba(72,123,255,0.4)]'
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
                        onClick={() => {
                          if (!isLocked) {
                            onPageSelect(pageNumber)
                            onClose()
                          }
                        }}
                        disabled={isLocked}
                        className={`relative group flex flex-col items-center gap-2 transition-all ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
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
                              <Lock
                                size={32}
                                variant="Bold"
                                color="currentColor"
                              />
                            )}
                          </div>

                          {/* Feature Icons (Top Left) */}
                          <div className="absolute top-1.5 left-1.5 flex gap-1">
                            {page.hasHighlights && (
                              <div
                                className={`bg-[#F3C353] rounded-md flex items-center justify-center shadow-sm text-white ${
                                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                                }`}
                              >
                                <LampOn
                                  size={isMobile ? 16 : 24}
                                  variant="Linear"
                                  color="currentColor"
                                />
                              </div>
                            )}
                            {page.hasAnnotations && (
                              <div
                                className={`bg-[#46B35E] rounded-md flex items-center justify-center shadow-sm text-white ${
                                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                                }`}
                              >
                                <Stickynote
                                  size={isMobile ? 16 : 24}
                                  variant="Outline"
                                  color="currentColor"
                                />
                              </div>
                            )}
                            {page.hasDrawings && (
                              <div
                                className={`bg-[#8A5CCC] rounded-md flex items-center justify-center shadow-sm text-white ${
                                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                                }`}
                              >
                                <Edit2
                                  size={isMobile ? 16 : 24}
                                  variant="Outline"
                                  color="currentColor"
                                />
                              </div>
                            )}
                            {page.isBookmarked && (
                              <div
                                className={`bg-white rounded-md flex items-center justify-center shadow-sm text-[#487BFF] ${
                                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                                }`}
                              >
                                <ArchiveAdd
                                  size={isMobile ? 16 : 24}
                                  variant="Bold"
                                  color="currentColor"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer: Page Number & Status */}
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          {isCompleted && (
                            <TickCircle
                              size={isMobile ? 16 : 20}
                              variant="Bold"
                              color="#46B35E"
                            />
                          )}
                          <span
                            className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} ${numberColorClass}`}
                          >
                            {pageNumber}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

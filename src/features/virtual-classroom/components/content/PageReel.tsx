import React, { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Edit2, Stickynote, ArchiveAdd, Lock, LampOn } from 'iconsax-react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/use-media-query'
import type { PageFilter } from '@/features/page-progress'

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
  variant?: 'default' | 'gamified'
}

export const PageReel: React.FC<PageReelProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage,
  onPageSelect,
  onMouseEnter,
  onMouseLeave,
  variant = 'default',
}) => {
  const { t } = useTranslation('pageReel')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeFilters, setActiveFilters] = useState<PageFilter[]>([])

  const availableFilters: Array<{
    id: PageFilter
    label: string
  }> = [
    { id: 'bookmarked', label: 'Páginas marcadas' },
    { id: 'with-annotations', label: 'Com anotações' },
    { id: 'with-highlights', label: 'Com Marcações' },
    { id: 'with-drawings', label: 'Com desenhos' },
    { id: 'completed', label: 'Concluídos' },
    { id: 'not-completed', label: 'Não concluídos' },
  ]

  const toggleFilter = (filterId: PageFilter) => {
    setActiveFilters((prev) => {
      const conflictingFilters: Record<string, PageFilter[]> = {
        completed: ['not-completed'],
        'not-completed': ['completed'],
      }

      const newFilters = prev.filter((f) => {
        const conflicts = conflictingFilters[filterId] || []
        return !conflicts.includes(f)
      })

      if (newFilters.includes(filterId)) {
        return newFilters.filter((f) => f !== filterId)
      }
      return [...newFilters, filterId]
    })
  }

  const filteredPages = useMemo(() => {
    if (activeFilters.length === 0) {
      return pages
    }

    return pages.filter((page) => {
      return activeFilters.every((filter) => {
        switch (filter) {
          case 'bookmarked':
            return page.isBookmarked
          case 'with-annotations':
            return page.hasAnnotations
          case 'with-highlights':
            return page.hasHighlights
          case 'with-drawings':
            return page.hasDrawings
          case 'completed':
            return page.isCompleted
          case 'not-completed':
            return !page.isCompleted
          default:
            return true
        }
      })
    })
  }, [pages, activeFilters])

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 ${isMobile ? 'z-60' : 'z-40'}`}
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
            className={`fixed bg-[#2C2C2C] shadow-xl ${
              isMobile
                ? `inset-x-0 bottom-0 rounded-t-3xl ${
                    variant === 'gamified' ? 'h-[70vh] z-60' : 'h-[85vh] z-60'
                  }`
                : `bottom-30 left-1/2 rounded-2xl w-[90vw] max-w-411 transition-all duration-300 ease-in-out z-40 ${
                    isMaximized ? 'h-[80vh] max-h-154.75' : 'h-80'
                  }`
            }`}
          >
            <div className="relative w-full h-full flex flex-col overflow-hidden">
              {!isMobile && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-3 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer backdrop-blur-sm border border-white/10"
                    title={isMaximized ? t('minimize') : t('maximize')}
                  >
                    {isMaximized ? (
                      <Minimize2 size={24} />
                    ) : (
                      <Maximize2 size={24} />
                    )}
                  </button>
                </div>
              )}

              {!isMobile && (
                <div
                  className={isMaximized ? 'px-8 pt-6 pb-4' : 'px-4 pt-3 pb-2'}
                >
                  <div
                    className={`flex gap-2 justify-center ${isMaximized ? 'flex-wrap' : 'overflow-x-auto no-scrollbar'}`}
                  >
                    {availableFilters.map((filter) => {
                      const isActive = activeFilters.includes(filter.id)
                      const count = filteredPages.filter((page) => {
                        switch (filter.id) {
                          case 'bookmarked':
                            return page.isBookmarked
                          case 'with-annotations':
                            return page.hasAnnotations
                          case 'with-highlights':
                            return page.hasHighlights
                          case 'with-drawings':
                            return page.hasDrawings
                          case 'completed':
                            return page.isCompleted
                          case 'not-completed':
                            return !page.isCompleted
                          default:
                            return false
                        }
                      }).length
                      return (
                        <button
                          key={filter.id}
                          onClick={() => toggleFilter(filter.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'bg-[#487BFF] text-white shadow-md'
                              : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <span>{filter.label}</span>
                          <span
                            className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}
                          >
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div
                className={`w-full flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${
                  isMobile
                    ? 'px-4 pt-2 pb-12'
                    : isMaximized
                      ? 'p-8 pt-4'
                      : 'px-6 py-3'
                }`}
              >
                <div
                  className={`gap-4 ${
                    isMobile || isMaximized
                      ? 'grid pb-12'
                      : 'flex overflow-x-auto overflow-y-hidden items-center px-4 pb-2'
                  }`}
                  style={
                    isMobile || isMaximized
                      ? {
                          gridTemplateColumns: isMobile
                            ? 'repeat(auto-fill, minmax(140px, 1fr))'
                            : 'repeat(auto-fill, minmax(180px, 1fr))',
                        }
                      : undefined
                  }
                >
                  {filteredPages.map((page) => {
                    const realIndex = pages.findIndex((p) => p.id === page.id)
                    const pageNumber = realIndex + 1
                    const isActive = currentPage === pageNumber
                    const isLocked = page.isLocked
                    const isCompleted = page.isCompleted && !isActive

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
                        key={page.id}
                        onClick={() => {
                          if (!isLocked) {
                            onPageSelect(pageNumber)
                            onClose()
                          }
                        }}
                        disabled={isLocked}
                        className={`relative group flex flex-col items-center gap-2 transition-all ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                        } ${!isMobile && !isMaximized ? 'shrink-0 w-52' : !isMobile && isMaximized ? 'w-full' : 'w-full'}`}
                      >
                        <div className="relative w-full">
                          {page.isBookmarked && (
                            <div className="absolute -top-2 right-4 z-10">
                              <div
                                className={`bg-white flex items-center justify-center shadow-md text-[#487BFF] ${
                                  isMobile ? 'w-7 h-7' : 'w-10 h-10'
                                }`}
                              >
                                <ArchiveAdd
                                  size={isMobile ? 20 : 28}
                                  variant="Bold"
                                  color="currentColor"
                                />
                              </div>
                            </div>
                          )}

                          <div
                            className={`relative w-full aspect-4/3 rounded-lg overflow-hidden bg-white transition-all ${borderClass} ${shadowClass}`}
                          >
                            <div className="absolute inset-0 overflow-hidden bg-white">
                              <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] p-8 pointer-events-none select-none text-left text-black">
                                {page.content}
                              </div>
                            </div>

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
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 -mt-0.5">
                          <span
                            className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} ${numberColorClass}`}
                          >
                            {pageNumber}
                          </span>

                          <div className="flex items-center gap-1">
                            {page.hasHighlights && (
                              <div className="bg-[#F3C353] rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                <LampOn
                                  size={16}
                                  variant="Linear"
                                  color="white"
                                />
                              </div>
                            )}
                            {page.hasAnnotations && (
                              <div className="bg-[#46B35E] rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                <Stickynote
                                  size={16}
                                  variant="Linear"
                                  color="white"
                                />
                              </div>
                            )}
                            {page.hasDrawings && (
                              <div className="bg-[#8A5CCB] rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                <Edit2
                                  size={16}
                                  variant="Linear"
                                  color="white"
                                />
                              </div>
                            )}
                          </div>
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

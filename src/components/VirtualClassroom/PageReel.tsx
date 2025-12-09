import React, { useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageReelProps {
  isOpen: boolean
  onClose: () => void
  pages: { id: string | number; content: React.ReactNode }[]
  currentPage: number
  onPageSelect: (pageIndex: number) => void
}

export const PageReel: React.FC<PageReelProps> = ({
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
  pages,
  currentPage,
  onPageSelect,
}) => {
  const [isMaximized, setIsMaximized] = useState(false)

  if (!isOpen) return null

  return (
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
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
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

              return (
                <button
                  key={index}
                  onClick={() => onPageSelect(pageNumber)}
                  className={`relative shrink-0 group flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isMaximized ? 'w-full' : 'w-[198px]'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div
                    className={`relative w-full aspect-4/3 rounded-lg overflow-hidden bg-white border-2 transition-all ${
                      isActive
                        ? 'border-[#FF246E] shadow-[0_0_10px_rgba(255,36,110,0.5)]'
                        : 'border-transparent group-hover:border-white/30'
                    }`}
                  >
                    {/* Page Preview */}
                    <div className="absolute inset-0 overflow-hidden bg-white">
                      <div className="w-[400%] h-[400%] origin-top-left scale-[0.25] p-8 pointer-events-none select-none text-left text-black">
                        {page.content}
                      </div>
                    </div>

                    {/* Overlay for interaction handling */}
                    <div className="absolute inset-0 bg-transparent" />

                    {/* Page Number Badge */}
                    <div className="absolute top-2 left-2 bg-white text-black font-bold text-xs px-2 py-1 rounded shadow-sm z-10">
                      {pageNumber}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

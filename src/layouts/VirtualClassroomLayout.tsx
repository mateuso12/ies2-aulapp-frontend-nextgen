import React, { type ReactNode, useRef, useState, useEffect } from 'react'
import { Header } from '../components/VirtualClassroom/Header'
import { Footer } from '../components/VirtualClassroom/Footer'
import { WritingToolbar } from '../components/Annotations/WritingToolbar'
import { Paper } from '../components/VirtualClassroom/Paper'
import { DrawingArea } from '../components/Annotations/DrawingArea'
import { useAnnotations } from '../hooks/useAnnotations'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import type { PageData } from '../components/VirtualClassroom/PageReel'
import { ArchiveAdd } from 'iconsax-react'
import { BookmarksSidebar } from '../components/VirtualClassroom/BookmarksSidebar'

export type ResourceType =
  | 'content'
  | 'exercise_list'
  | 'gamified'
  | 'assessment'
  | 'scorm'
  | 'simulation'
  | 'material'

interface VirtualClassroomLayoutProps {
  children: ReactNode
  variant?: 'default' | 'gamified'
  resourceType?: ResourceType | string
  currentPage?: number
  totalPages?: number
  pages?: PageData[]
  bookmarks?: number[]
  onNext?: () => void
  onPrevious?: () => void
  onPageSelect?: (page: number) => void
  onToggleBookmark?: (page: number) => void
  onRemoveBookmark?: (page: number) => void
}

export const VirtualClassroomLayout: React.FC<VirtualClassroomLayoutProps> = ({
  children,
  variant: initialVariant = 'default',
  resourceType: initialResourceType = 'content',
  currentPage = 1,
  totalPages = 1,
  pages = [],
  bookmarks = [],
  onNext,
  onPrevious,
  onPageSelect,
  onToggleBookmark,
  onRemoveBookmark,
}) => {
  const [variant, setVariant] = useState(initialVariant)
  const [resourceType, setResourceType] = useState(initialResourceType)
  const [isBookmarksSidebarOpen, setIsBookmarksSidebarOpen] = useState(false)

  useEffect(() => {
    setVariant(initialVariant)
    setResourceType(initialResourceType)
  }, [initialVariant, initialResourceType])

  const {
    strokes,
    setStrokes,
    config,
    setConfig,
    isVisible,
    setIsVisible,
    clearStrokes,
  } = useAnnotations(`page-${currentPage}`, 'user-1')

  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: mainRef })
  const bgY = useTransform(scrollY, [0, 1000], [0, 200])

  const isContent = resourceType === 'content' || resourceType === 'material'
  const showPaper = variant === 'gamified'
  const enableDrawing = isContent

  const isCurrentPageBookmarked = bookmarks.includes(currentPage)

  const handleBookmarkClick = () => {
    if (!isCurrentPageBookmarked) {
      onToggleBookmark?.(currentPage)
    }
    setIsBookmarksSidebarOpen(true)
  }

  const BookmarkButton = () => (
    <button
      onClick={handleBookmarkClick}
      className="flex items-center justify-center transition-colors cursor-pointer hover:opacity-80"
      title={isCurrentPageBookmarked ? 'Ver marcadores' : 'Adicionar marcador'}
    >
      <ArchiveAdd
        size="48"
        color={isCurrentPageBookmarked ? '#487BFF' : '#6C757D'}
        variant="Bold"
      />
    </button>
  )

  // Enhance pages with drawing status from localStorage/state
  const enhancedPages = pages.map((page, index) => {
    const pageNum = index + 1
    const storageKey = `annotations-user-1-page-${pageNum}`
    let hasStoredDrawings = false
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        hasStoredDrawings = Array.isArray(parsed) && parsed.length > 0
      }
    } catch {
      // Ignore storage errors
    }

    const isCurrentPage = pageNum === currentPage
    const hasDrawings = isCurrentPage ? strokes.length > 0 : hasStoredDrawings

    return {
      ...page,
      hasDrawings,
      // Reset hasAnnotations as we only track drawings for now
      hasAnnotations: false,
    }
  })

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      <Header
        variant={variant}
        currentPage={currentPage}
        totalPages={totalPages}
        resourceType={resourceType}
      />

      <BookmarksSidebar
        isOpen={isBookmarksSidebarOpen}
        onClose={() => setIsBookmarksSidebarOpen(false)}
        bookmarks={bookmarks}
        currentPage={currentPage}
        onRemoveBookmark={(page) => onRemoveBookmark?.(page)}
        onNavigate={(page) => onPageSelect?.(page)}
      />

      {/* Fixed Bookmark Button Layer */}
      {isContent && (
        <div className="absolute inset-0 z-30 pointer-events-none flex justify-center">
          <div className="w-full max-w-[1400px] h-full relative px-12">
            <div className="absolute right-12 top-[110px] pointer-events-auto">
              <BookmarkButton />
            </div>
          </div>
        </div>
      )}

      <main
        ref={mainRef}
        className={`flex-1 overflow-auto relative custom-scrollbar ${
          variant === 'gamified' ? '' : 'bg-[#F5F7FB]'
        }`}
      >
        {variant === 'gamified' && (
          <>
            <div className="fixed inset-0 z-0 bg-[#C6D3F5]" />
            <motion.div
              style={{ y: bgY, scale: 1.1 }}
              className="fixed inset-0 z-0 bg-[url('/imgs/bg_gamified.svg')] bg-cover bg-center opacity-20"
            />
          </>
        )}

        {showPaper ? (
          <div className="relative z-10 min-h-full">
            <Paper
              pageId={`page-${currentPage}`}
              strokes={strokes}
              currentConfig={config}
              isDrawingMode={isVisible && enableDrawing}
              onStrokesChange={setStrokes}
            >
              {children}
            </Paper>
          </div>
        ) : enableDrawing ? (
          <DrawingArea
            pageId={`page-${currentPage}`}
            strokes={strokes}
            currentConfig={config}
            isDrawingMode={isVisible}
            onStrokesChange={setStrokes}
            className="w-full min-h-full flex justify-center pt-[180px] px-12 pb-12"
          >
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </DrawingArea>
        ) : (
          <div className="w-full min-h-full flex justify-center pt-[180px] px-12 pb-12">
            <div className="w-full max-w-[1400px] relative">{children}</div>
          </div>
        )}
      </main>

      <AnimatePresence>
        {enableDrawing && isVisible && (
          <WritingToolbar
            currentConfig={config}
            onConfigChange={setConfig}
            onClear={clearStrokes}
            onClose={() => setIsVisible(false)}
          />
        )}
      </AnimatePresence>

      <Footer
        onToggleAnnotations={() => setIsVisible(!isVisible)}
        isAnnotationsVisible={isVisible}
        resourceType={resourceType}
        currentPage={currentPage}
        totalPages={totalPages}
        pages={enhancedPages}
        onNext={onNext}
        onPrevious={onPrevious}
        onPageSelect={onPageSelect}
      />

      {/* DevTools - Only visible in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 p-2 rounded-lg text-white text-xs">
          <label className="block mb-1 font-bold">
            DevTools: Resource Type
          </label>
          <select
            value={resourceType}
            onChange={(e) => {
              const type = e.target.value
              setResourceType(type)
              if (type === 'gamified') {
                setVariant('gamified')
              } else {
                setVariant('default')
              }
            }}
            className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white w-full"
          >
            <option value="content">Conteúdo</option>
            <option value="exercise_list">Lista de Exercícios</option>
            <option value="gamified">Gamificada</option>
            <option value="assessment">Avaliação</option>
            <option value="scorm">SCORM</option>
            <option value="simulation">Simulado</option>
            <option value="material">Material de Apoio</option>
          </select>
        </div>
      )}
    </div>
  )
}

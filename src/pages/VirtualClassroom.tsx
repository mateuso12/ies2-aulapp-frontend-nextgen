import React, { useState, useMemo } from 'react'
import parse from 'html-react-parser'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout/index'
import { mockContentPages } from '../mocks/virtualClassroomContent'
import { TextHighlighter } from '@/features/annotations/highlighting'
import { createFirebaseHighlightRepository } from '@/features/annotations/highlighting/repositories'
import { useUser } from '@/hooks/useUser'
import { DevTools } from '@/features/virtual-classroom/components/overlays'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'

export const VirtualClassroom: React.FC = () => {
  const { userId } = useUser()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([1])
  const [maxReachedIndex, setMaxReachedIndex] = useState(0)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [resourceType, setResourceType] = useState('content')
  const currentPage = mockContentPages[currentPageIndex]
  const totalPages = mockContentPages.length

  React.useEffect(() => {
    const pageNum = currentPageIndex + 1
    setVisitedPages((prev) => {
      if (!prev.includes(pageNum)) {
        return [...prev, pageNum]
      }
      return prev
    })

    if (currentPageIndex > maxReachedIndex) {
      setMaxReachedIndex(currentPageIndex)
    }
  }, [currentPageIndex, maxReachedIndex])

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPageIndex(page - 1)
    }
  }

  const handleToggleBookmark = (page: number) => {
    setBookmarks((prev) => {
      if (prev.includes(page)) {
        return prev.filter((p) => p !== page)
      }
      return [...prev, page].sort((a, b) => a - b)
    })
  }

  const handleRemoveBookmark = (page: number) => {
    setBookmarks((prev) => prev.filter((p) => p !== page))
  }

  // Transform mock data to include status and features for the PageReel
  // Parse HTML strings to ReactNode for the preview
  const pagesData: PageData[] = mockContentPages.map((page, index) => {
    const pageNumber = index + 1
    const isLocked = pageNumber > maxReachedIndex + 3
    const isCompleted = visitedPages.includes(pageNumber)

    return {
      id: page.id,
      content: parse(page.contentHtml || ''),
      isLocked,
      isCompleted,
      hasDrawings: index === 1 || index === 3,
      hasAnnotations: index === 0 || index === 2,
      isBookmarked: bookmarks.includes(pageNumber),
    }
  })

  // Cria repositório Firebase para highlights do usuário
  const highlightRepository = useMemo(() => {
    if (!userId) return undefined
    return createFirebaseHighlightRepository(userId)
  }, [userId])

  return (
    <>
      <DevTools
        resourceType={resourceType}
        onResourceTypeChange={setResourceType}
      />
      <VirtualClassroomLayout
        variant={resourceType === 'gamified' ? 'gamified' : 'default'}
        resourceType={resourceType}
        currentPage={currentPageIndex + 1}
        totalPages={totalPages}
        pages={pagesData}
        bookmarks={bookmarks}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onPageSelect={handlePageSelect}
        onToggleBookmark={handleToggleBookmark}
        onRemoveBookmark={handleRemoveBookmark}
      >
        {({ isOtherToolActive }) => (
          <TextHighlighter
            key={`${currentPage.id}-${userId || 'loading'}`}
            documentId={`virtual-classroom-page-${currentPage.id}`}
            contentHtml={currentPage.contentHtml || ''}
            disabled={isOtherToolActive}
            repository={highlightRepository}
          />
        )}
      </VirtualClassroomLayout>
    </>
  )
}

import React, { useState, useMemo } from 'react'
import parse from 'html-react-parser'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout/index'
import { mockContentPages } from '../mocks/virtualClassroomContent'
import { TextHighlighter } from '@/features/annotations/highlighting'
import { createFirebaseHighlightRepository } from '@/features/annotations/highlighting/repositories'
import { useUser } from '@/hooks/useUser'
import { usePageProgress } from '@/hooks/usePageProgress'
import { DevTools } from '@/features/virtual-classroom/components/overlays'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'

export const VirtualClassroom: React.FC = () => {
  const { userId } = useUser()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [resourceType, setResourceType] = useState('content')
  
  const resourceId = 'virtual-classroom-demo'
  
  const {
    visitedPages,
    bookmarks,
    toggleBookmark,
    removeBookmark,
  } = usePageProgress({
    resourceId,
    userId,
    currentPage: currentPageIndex + 1,
  })

  const currentPage = mockContentPages[currentPageIndex]
  const totalPages = mockContentPages.length

  const maxReachedIndex = useMemo(() => {
    if (visitedPages.length === 0) return 0
    return Math.max(...visitedPages) - 1
  }, [visitedPages])

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
    toggleBookmark(page)
  }

  const handleRemoveBookmark = (page: number) => {
    removeBookmark(page)
  }

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

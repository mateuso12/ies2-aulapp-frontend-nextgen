import React, { useState } from 'react'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout'
import { mockContentPages } from '../mocks/virtualClassroomContent'
import type { PageData } from '../components/VirtualClassroom/PageReel'

export const VirtualClassroom: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [visitedPages, setVisitedPages] = useState<number[]>([1])
  const [maxReachedIndex, setMaxReachedIndex] = useState(0)
  const [bookmarks, setBookmarks] = useState<number[]>([])
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
  const pagesData: PageData[] = mockContentPages.map((page, index) => {
    const pageNumber = index + 1
    // Mock logic:
    // - Pages visited are completed
    // - Pages after max reached + 2 are locked (just for demo)
    const isLocked = pageNumber > maxReachedIndex + 3
    const isCompleted = visitedPages.includes(pageNumber)

    return {
      id: page.id,
      content: page.content,
      isLocked,
      isCompleted,
      // Mock features
      hasDrawings: index === 1 || index === 3,
      hasAnnotations: index === 0 || index === 2,
      isBookmarked: bookmarks.includes(pageNumber),
    }
  })

  return (
    <VirtualClassroomLayout
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
      <div className="text-gray-800">{currentPage.content}</div>
    </VirtualClassroomLayout>
  )
}

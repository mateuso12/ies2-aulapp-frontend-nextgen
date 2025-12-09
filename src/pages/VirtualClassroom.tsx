import React, { useState } from 'react'
import { VirtualClassroomLayout } from '../layouts/VirtualClassroomLayout'
import { mockContentPages } from '../mocks/virtualClassroomContent'

export const VirtualClassroom: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const currentPage = mockContentPages[currentPageIndex]
  const totalPages = mockContentPages.length

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

  return (
    <VirtualClassroomLayout
      variant="gamified"
      currentPage={currentPageIndex + 1}
      totalPages={totalPages}
      pages={mockContentPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onPageSelect={handlePageSelect}
    >
      <div className="text-gray-800">{currentPage.content}</div>
    </VirtualClassroomLayout>
  )
}

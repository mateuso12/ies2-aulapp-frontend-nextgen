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

  return (
    <VirtualClassroomLayout
      variant="gamified"
      currentPage={currentPageIndex + 1}
      totalPages={totalPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
    >
      <div className="text-gray-800">{currentPage.content}</div>
    </VirtualClassroomLayout>
  )
}

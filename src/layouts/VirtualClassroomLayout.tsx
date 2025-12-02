import React, { type ReactNode } from 'react'
import { Header } from '../components/VirtualClassroom/Header'
import { Footer } from '../components/VirtualClassroom/Footer'

interface VirtualClassroomLayoutProps {
  children: ReactNode
  variant?: 'default' | 'gamified'
  currentPage?: number
  totalPages?: number
}

export const VirtualClassroomLayout: React.FC<VirtualClassroomLayoutProps> = ({
  children,
  variant = 'default',
  currentPage = 1,
  totalPages = 1,
}) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      <Header
        variant={variant}
        currentPage={currentPage}
        totalPages={totalPages}
      />
      <main className="flex-1 overflow-auto">{children}</main>
      <Footer />
    </div>
  )
}

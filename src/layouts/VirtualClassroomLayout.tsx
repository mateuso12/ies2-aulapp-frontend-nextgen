import React, { type ReactNode } from 'react'
import { Header } from '../components/VirtualClassroom/Header'
import { Footer } from '../components/VirtualClassroom/Footer'

interface VirtualClassroomLayoutProps {
  children: ReactNode
}

export const VirtualClassroomLayout: React.FC<VirtualClassroomLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#1E1E1E]">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
      <Footer />
    </div>
  )
}

import type { ReactNode } from 'react'
import type { PageData } from '@/features/virtual-classroom/components/content/PageReel'

export type ResourceType =
  | 'content'
  | 'exercise_list'
  | 'gamified'
  | 'assessment'
  | 'scorm'
  | 'simulation'
  | 'material'
  | 'open_ended'

export interface VirtualClassroomLayoutProps {
  children: ReactNode | ((props: { isOtherToolActive: boolean }) => ReactNode)
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

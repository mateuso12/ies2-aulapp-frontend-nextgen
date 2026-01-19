import { useState, useEffect, useCallback } from 'react'
import { createFirebasePageProgressRepository } from '@/features/page-progress/repositories'
import type { PageProgress } from '@/features/page-progress/types'

interface UsePageProgressOptions {
  resourceId: string
  userId: string | null
  currentPage: number
}

/**
 * Hook para gerenciar progresso de páginas usando Firebase
 */
export function usePageProgress({
  resourceId,
  userId,
  currentPage,
}: UsePageProgressOptions) {
  const [visitedPages, setVisitedPages] = useState<number[]>([1])
  const [bookmarks, setBookmarks] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (!userId || !resourceId) {
      setIsLoading(false)
      return
    }

    const loadProgress = async () => {
      setIsLoading(true)
      try {
        const repository = createFirebasePageProgressRepository(userId)
        const progress = await repository.findByResourceId(resourceId)

        if (progress) {
          setVisitedPages(progress.visitedPages || [1])
          setBookmarks(progress.bookmarks || [])
        } else {
          setVisitedPages([1])
          setBookmarks([])
        }
      } catch (error) {
        console.error('[usePageProgress] Error loading progress:', error)
        setVisitedPages([1])
        setBookmarks([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [userId, resourceId])

  useEffect(() => {
    if (!userId || !resourceId || isLoading || isSyncing) {
      return
    }

    if (!visitedPages.includes(currentPage)) {
      setVisitedPages((prev) => [...prev, currentPage].sort((a, b) => a - b))
    }
  }, [currentPage, userId, resourceId, visitedPages, isLoading, isSyncing])

  useEffect(() => {
    if (!userId || !resourceId || isLoading) {
      return
    }

    const saveProgress = async () => {
      setIsSyncing(true)
      try {
        const repository = createFirebasePageProgressRepository(userId)
        const progress: PageProgress = {
          resourceId,
          visitedPages,
          bookmarks,
          lastVisitedPage: currentPage,
          updatedAt: new Date().toISOString(),
        }
        await repository.save(resourceId, progress)
      } catch (error) {
        console.error('[usePageProgress] Error saving progress:', error)
      } finally {
        setIsSyncing(false)
      }
    }

    const timeoutId = setTimeout(saveProgress, 500)
    return () => clearTimeout(timeoutId)
  }, [visitedPages, bookmarks, currentPage, userId, resourceId, isLoading])

  const toggleBookmark = useCallback(
    (pageNumber: number) => {
      setBookmarks((prev) => {
        if (prev.includes(pageNumber)) {
          return prev.filter((p) => p !== pageNumber)
        }
        return [...prev, pageNumber].sort((a, b) => a - b)
      })
    },
    []
  )

  const removeBookmark = useCallback((pageNumber: number) => {
    setBookmarks((prev) => prev.filter((p) => p !== pageNumber))
  }, [])

  const markPageAsVisited = useCallback((pageNumber: number) => {
    setVisitedPages((prev) => {
      if (prev.includes(pageNumber)) return prev
      return [...prev, pageNumber].sort((a, b) => a - b)
    })
  }, [])

  const isPageCompleted = useCallback(
    (pageNumber: number) => {
      return visitedPages.includes(pageNumber)
    },
    [visitedPages]
  )

  const isPageBookmarked = useCallback(
    (pageNumber: number) => {
      return bookmarks.includes(pageNumber)
    },
    [bookmarks]
  )

  return {
    visitedPages,
    bookmarks,
    isLoading,
    isSyncing,
    toggleBookmark,
    removeBookmark,
    markPageAsVisited,
    isPageCompleted,
    isPageBookmarked,
  }
}

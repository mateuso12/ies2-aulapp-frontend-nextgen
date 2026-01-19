import { ref, get, set, update } from 'firebase/database'
import { firebaseDatabase } from '@/services/firebase'
import type { PageProgress, UpdatePageProgressDTO } from '../types/pageProgress'

/**
 * Repositório Firebase para Progresso de Páginas
 * 
 * Estrutura no Firebase:
 * /annotations/{userId}/page-progress/{resourceId}
 */
export class FirebasePageProgressRepository {
  userId: string

  constructor(userId: string) {
    if (!userId) {
      throw new Error('FirebasePageProgressRepository requires a userId')
    }
    this.userId = userId
  }

  private getResourceProgressRef(resourceId: string) {
    return ref(
      firebaseDatabase,
      `annotations/${this.userId}/page-progress/${resourceId}`
    )
  }

  async findByResourceId(resourceId: string): Promise<PageProgress | null> {
    try {
      const snapshot = await get(this.getResourceProgressRef(resourceId))
      if (!snapshot.exists()) {
        return null
      }

      const data = snapshot.val()
      return {
        resourceId,
        visitedPages: data.visitedPages || [],
        bookmarks: data.bookmarks || [],
        lastVisitedPage: data.lastVisitedPage || 1,
        updatedAt: data.updatedAt || new Date().toISOString(),
      }
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error finding progress:', error)
      return null
    }
  }

  async save(resourceId: string, progress: PageProgress): Promise<void> {
    try {
      const resourceRef = this.getResourceProgressRef(resourceId)
      const data = {
        visitedPages: progress.visitedPages,
        bookmarks: progress.bookmarks,
        lastVisitedPage: progress.lastVisitedPage,
        updatedAt: new Date().toISOString(),
      }
      await set(resourceRef, data)
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error saving progress:', error)
      throw error
    }
  }

  async update(resourceId: string, updates: UpdatePageProgressDTO): Promise<void> {
    try {
      const resourceRef = this.getResourceProgressRef(resourceId)
      const data = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      await update(resourceRef, data)
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error updating progress:', error)
      throw error
    }
  }

  async markPageAsVisited(resourceId: string, pageNumber: number): Promise<void> {
    try {
      const progress = await this.findByResourceId(resourceId)
      const visitedPages = progress?.visitedPages || []
      
      if (!visitedPages.includes(pageNumber)) {
        const newVisitedPages = [...visitedPages, pageNumber].sort((a, b) => a - b)
        await this.update(resourceId, {
          visitedPages: newVisitedPages,
          lastVisitedPage: pageNumber,
        })
      } else {
        await this.update(resourceId, {
          lastVisitedPage: pageNumber,
        })
      }
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error marking page as visited:', error)
      throw error
    }
  }

  async toggleBookmark(resourceId: string, pageNumber: number): Promise<void> {
    try {
      const progress = await this.findByResourceId(resourceId)
      const bookmarks = progress?.bookmarks || []
      
      let newBookmarks: number[]
      if (bookmarks.includes(pageNumber)) {
        newBookmarks = bookmarks.filter((p) => p !== pageNumber)
      } else {
        newBookmarks = [...bookmarks, pageNumber].sort((a, b) => a - b)
      }

      await this.update(resourceId, { bookmarks: newBookmarks })
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error toggling bookmark:', error)
      throw error
    }
  }

  async removeBookmark(resourceId: string, pageNumber: number): Promise<void> {
    try {
      const progress = await this.findByResourceId(resourceId)
      const bookmarks = progress?.bookmarks || []
      const newBookmarks = bookmarks.filter((p) => p !== pageNumber)
      
      await this.update(resourceId, { bookmarks: newBookmarks })
    } catch (error) {
      console.error('[FirebasePageProgressRepository] Error removing bookmark:', error)
      throw error
    }
  }
}

export function createFirebasePageProgressRepository(userId: string) {
  return new FirebasePageProgressRepository(userId)
}

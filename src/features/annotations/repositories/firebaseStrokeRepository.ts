import { ref, get, set, remove } from 'firebase/database'
import { firebaseDatabase } from '@/services/firebase'
import type { Stroke } from '@/features/annotations/types/types'

/**
 * Repositório Firebase para Strokes (desenhos/anotações)
 * 
 * Estrutura no Firebase:
 * /annotations/{userId}/strokes/{pageId}
 */
export class FirebaseStrokeRepository {
  userId: string

  constructor(userId: string) {
    if (!userId) {
      throw new Error('FirebaseStrokeRepository requires a userId')
    }
    this.userId = userId
  }

  /**
   * Retorna a referência para os strokes de uma página específica
   */
  private getPageStrokesRef(pageId: string) {
    return ref(
      firebaseDatabase,
      `annotations/${this.userId}/strokes/${pageId}`
    )
  }

  /**
   * Busca todos os strokes de uma página
   */
  async findByPageId(pageId: string): Promise<Stroke[]> {
    try {
      const snapshot = await get(this.getPageStrokesRef(pageId))
      if (!snapshot.exists()) return []

      const data = snapshot.val()
      
      // Se for um objeto com IDs como chaves, converte para array
      if (typeof data === 'object' && !Array.isArray(data)) {
        return Object.values(data)
      }
      
      // Se já for array, retorna
      if (Array.isArray(data)) {
        return data
      }

      return []
    } catch (error) {
      console.error('[FirebaseStrokeRepository] Error finding strokes:', error)
      return []
    }
  }

  /**
   * Salva todos os strokes de uma página
   */
  async saveAll(pageId: string, strokes: Stroke[]): Promise<void> {
    try {
      const pageRef = this.getPageStrokesRef(pageId)
      
      if (strokes.length === 0) {
        // Remove se não houver strokes
        await remove(pageRef)
      } else {
        // Salva array de strokes
        await set(pageRef, strokes)
      }
    } catch (error) {
      console.error('[FirebaseStrokeRepository] Error saving strokes:', error)
      throw error
    }
  }

  /**
   * Remove todos os strokes de uma página
   */
  async deleteByPageId(pageId: string): Promise<void> {
    try {
      const pageRef = this.getPageStrokesRef(pageId)
      await remove(pageRef)
    } catch (error) {
      console.error('[FirebaseStrokeRepository] Error deleting strokes:', error)
      throw error
    }
  }

  /**
   * Limpa todos os strokes do usuário
   */
  async deleteAll(): Promise<void> {
    try {
      const userStrokesRef = ref(
        firebaseDatabase,
        `annotations/${this.userId}/strokes`
      )
      await remove(userStrokesRef)
    } catch (error) {
      console.error('[FirebaseStrokeRepository] Error deleting all strokes:', error)
      throw error
    }
  }
}

export const createFirebaseStrokeRepository = (
  userId: string
): FirebaseStrokeRepository => {
  return new FirebaseStrokeRepository(userId)
}

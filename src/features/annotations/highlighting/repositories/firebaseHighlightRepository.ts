import { ref, get, set, remove, push } from 'firebase/database'
import { firebaseDatabase } from '@/services/firebase'
import type {
  Highlight,
  CreateHighlightDTO,
  UpdateHighlightDTO,
} from '../types/highlight'
import type { HighlightRepository } from './highlightRepository'

/**
 * Repositório Firebase para Highlights
 * 
 * Estrutura no Firebase:
 * /annotations/{userId}/highlights/{documentId}/{highlightId}
 */
export class FirebaseHighlightRepository implements HighlightRepository {
  userId: string

  constructor(userId: string) {
    if (!userId) {
      throw new Error('FirebaseHighlightRepository requires a userId')
    }
    this.userId = userId
  }

  /**
   * Retorna a referência base para os highlights do usuário
   */
  private getUserHighlightsRef() {
    return ref(firebaseDatabase, `annotations/${this.userId}/highlights`)
  }

  /**
   * Retorna a referência para os highlights de um documento específico
   */
  private getDocumentHighlightsRef(documentId: string) {
    return ref(
      firebaseDatabase,
      `annotations/${this.userId}/highlights/${documentId}`
    )
  }

  async findByDocumentId(documentId: string): Promise<Highlight[]> {
    try {
      const snapshot = await get(this.getDocumentHighlightsRef(documentId))
      if (!snapshot.exists()) {
        return []
      }

      const data = snapshot.val()
      
      // Converte objeto com IDs como chaves para array
      const highlights = Object.entries(data).map(([id, highlight]) => ({
        ...(highlight as Highlight),
        id,
      }))
      
      return highlights
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error finding by documentId:', error)
      return []
    }
  }

  async findById(id: string): Promise<Highlight | null> {
    try {
      // Precisamos buscar em todos os documentos
      const snapshot = await get(this.getUserHighlightsRef())
      if (!snapshot.exists()) return null

      const allDocuments = snapshot.val()
      
      // Procura o highlight em todos os documentos
      for (const documentId in allDocuments) {
        const document = allDocuments[documentId]
        if (document[id]) {
          return {
            ...document[id],
            id,
          } as Highlight
        }
      }

      return null
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error finding by id:', error)
      return null
    }
  }

  async create(data: CreateHighlightDTO): Promise<Highlight> {
    try {
      const documentRef = this.getDocumentHighlightsRef(data.documentId)
      const newHighlightRef = push(documentRef)
      
      const highlight: Omit<Highlight, 'id'> = {
        ...data,
        createdAt: new Date().toISOString(),
      }

      await set(newHighlightRef, highlight)

      const createdHighlight: Highlight = {
        ...highlight,
        id: newHighlightRef.key!,
      }

      // Dispara evento para componentes ouvirem
      window.dispatchEvent(new Event('highlightsChanged'))

      return createdHighlight
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error creating:', error)
      throw error
    }
  }

  async update(
    id: string,
    data: UpdateHighlightDTO
  ): Promise<Highlight | null> {
    try {
      const existing = await this.findById(id)
      if (!existing || !existing.documentId) return null

      const updated: Omit<Highlight, 'id'> = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      }

      const highlightRef = ref(
        firebaseDatabase,
        `annotations/${this.userId}/highlights/${existing.documentId}/${id}`
      )

      await set(highlightRef, updated)

      window.dispatchEvent(new Event('highlightsChanged'))

      return {
        ...updated,
        id,
      }
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error updating:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const existing = await this.findById(id)
      if (!existing || !existing.documentId) return false

      const highlightRef = ref(
        firebaseDatabase,
        `annotations/${this.userId}/highlights/${existing.documentId}/${id}`
      )

      await remove(highlightRef)

      window.dispatchEvent(new Event('highlightsChanged'))

      return true
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error deleting:', error)
      return false
    }
  }

  async deleteByDocumentId(documentId: string): Promise<number> {
    try {
      const highlights = await this.findByDocumentId(documentId)
      const count = highlights.length

      const documentRef = this.getDocumentHighlightsRef(documentId)
      await remove(documentRef)

      window.dispatchEvent(new Event('highlightsChanged'))

      return count
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error deleting by documentId:', error)
      return 0
    }
  }

  async saveAll(documentId: string, highlights: Highlight[]): Promise<void> {
    try {
      const documentRef = this.getDocumentHighlightsRef(documentId)
      
      // Converte array para objeto com IDs como chaves
      const highlightsObj = highlights.reduce(
        (acc, highlight) => {
          const { id, ...data } = highlight
          acc[id] = data
          return acc
        },
        {} as Record<string, Omit<Highlight, 'id'>>
      )

      await set(documentRef, highlightsObj)

      window.dispatchEvent(new Event('highlightsChanged'))
    } catch (error) {
      console.error('[FirebaseHighlightRepository] Error saving all:', error)
      throw error
    }
  }
}

export const createFirebaseHighlightRepository = (
  userId: string
): HighlightRepository => {
  return new FirebaseHighlightRepository(userId)
}

import { ref, get, set, push, remove } from 'firebase/database'
import { firebaseDatabase } from '@/services/firebase'
import type { StickyNote } from '@/features/sticky-notes/types/types'

/**
 * Tipo para salvar no Firebase (converte Date para string)
 */
interface StickyNoteFirebase extends Omit<StickyNote, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
}

/**
 * Repositório Firebase para Sticky Notes
 * 
 * Estrutura no Firebase:
 * /annotations/{userId}/sticky-notes/{noteId}
 */
export class FirebaseStickyNoteRepository {
  userId: string

  constructor(userId: string) {
    if (!userId) {
      throw new Error('FirebaseStickyNoteRepository requires a userId')
    }
    this.userId = userId
  }

  /**
   * Retorna a referência para as sticky notes do usuário
   */
  private getUserNotesRef() {
    return ref(firebaseDatabase, `annotations/${this.userId}/sticky-notes`)
  }

  /**
   * Retorna a referência para uma nota específica
   */
  private getNoteRef(noteId: string) {
    return ref(
      firebaseDatabase,
      `annotations/${this.userId}/sticky-notes/${noteId}`
    )
  }

  /**
   * Converte StickyNote para formato Firebase (Date -> string)
   */
  private toFirebase(note: StickyNote): StickyNoteFirebase {
    return {
      ...note,
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    }
  }

  /**
   * Converte formato Firebase para StickyNote (string -> Date)
   */
  private fromFirebase(note: StickyNoteFirebase, id: string): StickyNote {
    return {
      ...note,
      id,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }
  }

  /**
   * Busca todas as sticky notes do usuário
   */
  async findAll(): Promise<StickyNote[]> {
    try {
      const snapshot = await get(this.getUserNotesRef())
      if (!snapshot.exists()) return []

      const data = snapshot.val() as Record<string, StickyNoteFirebase>
      
      return Object.entries(data).map(([id, note]) => 
        this.fromFirebase(note, id)
      )
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error finding all notes:', error)
      return []
    }
  }

  /**
   * Busca uma nota específica por ID
   */
  async findById(noteId: string): Promise<StickyNote | null> {
    try {
      const snapshot = await get(this.getNoteRef(noteId))
      if (!snapshot.exists()) return null

      const data = snapshot.val() as StickyNoteFirebase
      return this.fromFirebase(data, noteId)
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error finding note:', error)
      return null
    }
  }

  /**
   * Cria uma nova sticky note
   */
  async create(note: Omit<StickyNote, 'id'>): Promise<StickyNote> {
    try {
      const notesRef = this.getUserNotesRef()
      const newNoteRef = push(notesRef)
      
      const noteToSave: StickyNoteFirebase = {
        id: newNoteRef.key!,
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      }

      await set(newNoteRef, noteToSave)

      return {
        ...note,
        id: newNoteRef.key!,
      }
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error creating note:', error)
      throw error
    }
  }

  /**
   * Atualiza uma sticky note existente
   */
  async update(note: StickyNote): Promise<void> {
    try {
      const noteRef = this.getNoteRef(note.id)
      const noteToSave = this.toFirebase({
        ...note,
        updatedAt: new Date(),
      })

      await set(noteRef, noteToSave)
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error updating note:', error)
      throw error
    }
  }

  /**
   * Remove uma sticky note
   */
  async delete(noteId: string): Promise<void> {
    try {
      const noteRef = this.getNoteRef(noteId)
      await remove(noteRef)
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error deleting note:', error)
      throw error
    }
  }

  /**
   * Salva todas as sticky notes (substitui tudo)
   */
  async saveAll(notes: StickyNote[]): Promise<void> {
    try {
      const notesRef = this.getUserNotesRef()
      
      if (notes.length === 0) {
        await remove(notesRef)
        return
      }

      // Converte array para objeto com IDs como chaves
      const notesObj = notes.reduce(
        (acc, note) => {
          acc[note.id] = this.toFirebase(note)
          return acc
        },
        {} as Record<string, StickyNoteFirebase>
      )

      await set(notesRef, notesObj)
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error saving all notes:', error)
      throw error
    }
  }

  /**
   * Limpa todas as sticky notes do usuário
   */
  async deleteAll(): Promise<void> {
    try {
      const notesRef = this.getUserNotesRef()
      await remove(notesRef)
    } catch (error) {
      console.error('[FirebaseStickyNoteRepository] Error deleting all notes:', error)
      throw error
    }
  }
}

export const createFirebaseStickyNoteRepository = (
  userId: string
): FirebaseStickyNoteRepository => {
  return new FirebaseStickyNoteRepository(userId)
}

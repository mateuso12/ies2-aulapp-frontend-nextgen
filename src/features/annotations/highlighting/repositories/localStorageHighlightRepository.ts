import type {
  Highlight,
  CreateHighlightDTO,
  UpdateHighlightDTO,
} from '../types/highlight'
import type { HighlightRepository } from './highlightRepository'

const STORAGE_PREFIX = 'aulapp:highlights'

function makeKey(documentId: string): string {
  return `${STORAGE_PREFIX}:${documentId}`
}
export class LocalStorageHighlightRepository implements HighlightRepository {
  async findByDocumentId(documentId: string): Promise<Highlight[]> {
    try {
      const raw = localStorage.getItem(makeKey(documentId))
      if (!raw) return []
      const parsed = JSON.parse(raw) as Highlight[]
      if (!Array.isArray(parsed)) return []
      return parsed
    } catch {
      return []
    }
  }

  async findById(id: string): Promise<Highlight | null> {
    // Sem índice global, varremos os documentos persistidos.
    const keys = this.getAllDocumentKeys()
    for (const key of keys) {
      const highlights = await this.findByDocumentId(
        this.extractDocumentId(key)
      )
      const found = highlights.find((h) => h.id === id)
      if (found) return found
    }
    return null
  }

  async create(data: CreateHighlightDTO): Promise<Highlight> {
    const highlight: Highlight = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    const highlights = await this.findByDocumentId(data.documentId)
    highlights.push(highlight)
    localStorage.setItem(makeKey(data.documentId), JSON.stringify(highlights))

    return highlight
  }

  async update(
    id: string,
    data: UpdateHighlightDTO
  ): Promise<Highlight | null> {
    const existing = await this.findById(id)
    if (!existing || !existing.documentId) return null

    const updated: Highlight = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    const highlights = await this.findByDocumentId(existing.documentId)
    const index = highlights.findIndex((h) => h.id === id)
    if (index === -1) return null

    highlights[index] = updated
    localStorage.setItem(
      makeKey(existing.documentId),
      JSON.stringify(highlights)
    )

    return updated
  }

  async delete(id: string): Promise<boolean> {
    const existing = await this.findById(id)
    if (!existing || !existing.documentId) return false

    const highlights = await this.findByDocumentId(existing.documentId)
    const filtered = highlights.filter((h) => h.id !== id)

    if (filtered.length === highlights.length) return false

    localStorage.setItem(makeKey(existing.documentId), JSON.stringify(filtered))
    return true
  }

  async deleteByDocumentId(documentId: string): Promise<number> {
    const highlights = await this.findByDocumentId(documentId)
    const count = highlights.length
    localStorage.removeItem(makeKey(documentId))
    return count
  }

  async saveAll(documentId: string, highlights: Highlight[]): Promise<void> {
    localStorage.setItem(makeKey(documentId), JSON.stringify(highlights))
  }

  private getAllDocumentKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key)
      }
    }
    return keys
  }

  private extractDocumentId(key: string): string {
    return key.replace(`${STORAGE_PREFIX}:`, '')
  }
}
export const localStorageHighlightRepository =
  new LocalStorageHighlightRepository()

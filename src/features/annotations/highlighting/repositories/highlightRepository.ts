// Contrato de persistência de highlights (localStorage, API, etc.).

import type {
  Highlight,
  CreateHighlightDTO,
  UpdateHighlightDTO,
} from '../types/highlight'

export interface HighlightRepository {
  findByDocumentId(documentId: string): Promise<Highlight[]>

  findById(id: string): Promise<Highlight | null>

  create(data: CreateHighlightDTO): Promise<Highlight>

  update(id: string, data: UpdateHighlightDTO): Promise<Highlight | null>

  delete(id: string): Promise<boolean>

  deleteByDocumentId(documentId: string): Promise<number>

  saveAll(documentId: string, highlights: Highlight[]): Promise<void>
}

export type HighlightRepositoryFactory = () => HighlightRepository

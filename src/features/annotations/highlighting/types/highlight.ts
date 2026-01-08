export type HighlightColor = 'yellow' | 'blue' | 'green' | 'pink'

export const HIGHLIGHT_COLORS: readonly HighlightColor[] = [
  'yellow',
  'blue',
  'green',
  'pink',
] as const

/**
 * Representa uma marcação de texto persistida.
 *
 * Inspirado no W3C Web Annotation Model:
 * - RangeSelector: xpathStart, xpathEnd, startOffset, endOffset
 * - TextQuoteSelector: exactText, prefix, suffix
 */
export interface Highlight {
  id: string

  color: HighlightColor

  xpathStart: string
  xpathEnd: string
  startOffset: number
  endOffset: number

  exactText: string
  prefix?: string
  suffix?: string

  createdAt: string

  documentId: string

  userId?: string

  updatedAt?: string
}

export interface HighlightAnchor {
  xpathStart: string
  xpathEnd: string
  startOffset: number
  endOffset: number
}

/**
 * Payload para criar um novo highlight via API.
 * Omite campos gerados pelo servidor (id, createdAt, updatedAt).
 */
export type CreateHighlightDTO = Omit<
  Highlight,
  'id' | 'createdAt' | 'updatedAt'
>

/**
 * Payload para atualizar um highlight existente.
 * Apenas cor pode ser alterada (posição é imutável).
 */
export interface UpdateHighlightDTO {
  color?: HighlightColor
}

/**
 * Resposta paginada de highlights (para listagem).
 */
export interface HighlightsListResponse {
  data: Highlight[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface HighlightsQueryParams {
  documentId: string
  userId?: string
  color?: HighlightColor
  page?: number
  pageSize?: number
}

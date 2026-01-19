/**
 * Tipos para gerenciamento de progresso de páginas
 */

/**
 * Progresso do usuário em um recurso específico
 */
export interface PageProgress {
  /** ID do recurso (aula/conteúdo) */
  resourceId: string
  /** Array de números das páginas já visitadas */
  visitedPages: number[]
  /** Array de números das páginas marcadas com bookmark */
  bookmarks: number[]
  /** Última página visitada pelo usuário */
  lastVisitedPage: number
  /** Timestamp da última atualização */
  updatedAt: string
}

/**
 * DTO para criar/atualizar progresso de página
 */
export type UpdatePageProgressDTO = Partial<
  Omit<PageProgress, 'resourceId' | 'updatedAt'>
>

/**
 * Tipos de filtros para o PageReel
 */
export type PageFilter =
  | 'all'
  | 'bookmarked'
  | 'with-annotations'
  | 'with-highlights'
  | 'with-drawings'
  | 'completed'
  | 'not-completed'

/**
 * Configuração de filtros ativos
 */
export interface PageFilters {
  active: PageFilter[]
}

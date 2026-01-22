/**
 * ContentView - Renderiza conteúdo de texto com suporte a highlighting
 */

import React from 'react'
import { TextHighlighter } from '@/features/annotations/highlighting'
import type { HighlightRepository } from '@/features/annotations/highlighting/repositories'

interface ContentViewProps {
  /** ID do documento para o highlighting */
  documentId: string
  /** HTML do conteúdo a ser exibido */
  contentHtml: string
  /** Desabilita highlighting quando outra ferramenta está ativa */
  disabled?: boolean
  /** Repositório de highlights do Firebase */
  repository?: HighlightRepository
}

export const ContentView: React.FC<ContentViewProps> = ({
  documentId,
  contentHtml,
  disabled = false,
  repository,
}) => {
  if (!repository) {
    return <div className="p-8 text-gray-500">Loading...</div>
  }

  return (
    <TextHighlighter
      documentId={documentId}
      contentHtml={contentHtml}
      disabled={disabled}
      repository={repository}
    />
  )
}

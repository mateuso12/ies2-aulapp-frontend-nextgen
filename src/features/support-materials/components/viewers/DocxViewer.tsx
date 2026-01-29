/**
 * DocxViewer - Visualizador de documentos Word (DOCX) usando mammoth.js
 * Converte DOCX para HTML para visualização no navegador
 */

import React, { useEffect, useState } from 'react'
import { DocumentText } from 'iconsax-react'
import mammoth from 'mammoth'

interface DocxViewerProps {
  /** URL do arquivo DOCX */
  url: string
  /** Título do arquivo */
  title: string
  /** Tamanho do arquivo formatado */
  size?: string
}

export const DocxViewer: React.FC<DocxViewerProps> = ({ url, title, size }) => {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDocx = async () => {
      try {
        setLoading(true)
        setError(null)

        // Buscar o arquivo
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Erro ao carregar o documento')
        }

        const arrayBuffer = await response.arrayBuffer()

        // Converter DOCX para HTML
        const result = await mammoth.convertToHtml({ arrayBuffer })
        setHtmlContent(result.value)
        setLoading(false)
      } catch (err) {
        console.error('Erro ao processar DOCX:', err)
        setError(
          'Não foi possível visualizar este documento. Tente fazer o download.'
        )
        setLoading(false)
      }
    }

    loadDocx()
  }, [url])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando documento...
          </p>
        </div>
      </div>
    )
  }

  if (error || !htmlContent) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
        {/* Ícone do documento */}
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900">
          <DocumentText
            size={64}
            className="text-blue-600 dark:text-blue-400"
            variant="Bold"
          />
        </div>

        {/* Informações do arquivo */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h3>
          {size && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Documento Word • {size}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <DocumentText size={20} className="text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Visualização do Documento
        </span>
      </div>

      {/* Conteúdo convertido */}
      <div className="flex-1 overflow-auto p-8">
        <div
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-12 prose prose-blue dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        />
      </div>
    </div>
  )
}

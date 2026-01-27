/**
 * PDFViewer - Visualizador de documentos PDF usando react-pdf
 * Suporta arquivos de qualquer origem (AWS, URLs públicas, etc)
 */

import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ArrowLeft, ArrowRight } from 'iconsax-react'

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  /** URL do arquivo PDF */
  url: string
  /** Título do arquivo */
  title?: string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [pdfWidth, setPdfWidth] = useState<number>(800)

  // Calcular largura responsiva do PDF
  useEffect(() => {
    const updateWidth = () => {
      const windowWidth = window.innerWidth
      if (windowWidth < 768) {
        // Mobile: largura completa com padding mínimo
        setPdfWidth(windowWidth - 32)
      } else {
        // Desktop: largura controlada
        setPdfWidth(Math.min(windowWidth - 100, 800))
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    setLoading(false)
    setError('Erro ao carregar o PDF. Tente fazer o download.')
    console.error('Erro ao carregar PDF:', error)
  }

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages))

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.open(url, '_blank')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Fazer Download
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Controles de navegação - Responsivo */}
      {numPages > 0 && (
        <div className="flex items-center justify-center gap-3 md:gap-4 px-2 py-3 md:py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="p-2 md:p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
            type="button"
          >
            <ArrowLeft
              size={20}
              className="md:w-6 md:h-6 text-gray-700 dark:text-gray-200"
              color="currentColor"
            />
          </button>

          <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap px-2">
            Página {pageNumber} de {numPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="p-2 md:p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Próxima página"
            type="button"
          >
            <ArrowRight
              size={20}
              className="md:w-6 md:h-6 text-gray-700 dark:text-gray-200"
              color="currentColor"
            />
          </button>
        </div>
      )}

      {/* Visualizador de PDF - Responsivo */}
      <div className="flex-1 overflow-auto p-2 md:p-4 flex justify-center items-start">
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading=""
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
            width={pdfWidth}
          />
        </Document>
      </div>
    </div>
  )
}
